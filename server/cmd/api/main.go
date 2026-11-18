package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"example.com/app-template/server/internal/config"
	"example.com/app-template/server/internal/httpapi"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))

	if err := run(logger); err != nil {
		logger.Error("api server stopped", "error", err)
		os.Exit(1)
	}

	logger.Info("api server stopped cleanly")
}

// run returns instead of exiting so deferred cleanup, such as closing the database, always runs.
func run(logger *slog.Logger) error {
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	signals, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	db, err := openDatabase(signals, cfg.Database, appMigrations, logger)
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	if db != nil {
		defer func() {
			if err := db.Close(); err != nil {
				logger.Error("close database", "error", err)
			}
		}()
	}

	server := httpapi.NewServer(cfg, logger)
	errCh := make(chan error, 1)

	go func() {
		logger.Info("api server listening", "addr", cfg.HTTP.Address, "env", cfg.AppEnv)
		errCh <- server.ListenAndServe()
	}()

	select {
	case err := <-errCh:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return err
		}

		return nil
	case <-signals.Done():
		logger.Info("shutdown requested")
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("shutdown: %w", err)
	}

	if err := <-errCh; err != nil && !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("shutdown: %w", err)
	}

	return nil
}
