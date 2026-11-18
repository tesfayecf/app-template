package main

import (
	"context"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"testing"

	"example.com/app-template/server/internal/config"
	"example.com/app-template/server/internal/sqlite"
)

func TestOpenDatabaseIsSkippedWithoutPath(t *testing.T) {
	db, err := openDatabase(context.Background(), config.DatabaseConfig{}, nil, discardLogger())
	if err != nil {
		t.Fatalf("openDatabase() error = %v", err)
	}
	if db != nil {
		t.Fatal("openDatabase() returned a database although SQLITE_PATH is unset")
	}
}

func TestOpenDatabaseMigratesAndBacksUpBeforeLaterMigrations(t *testing.T) {
	dir := t.TempDir()
	cfg := config.DatabaseConfig{
		BackupDir: filepath.Join(dir, "backups"),
		Enabled:   true,
		Path:      filepath.Join(dir, "app.db"),
	}
	first := []sqlite.Migration{{Version: 1, SQL: "CREATE TABLE items (id INTEGER PRIMARY KEY)"}}

	db, err := openDatabase(context.Background(), cfg, first, discardLogger())
	if err != nil {
		t.Fatalf("first openDatabase() error = %v", err)
	}
	if err := db.Close(); err != nil {
		t.Fatalf("Close() error = %v", err)
	}
	if entries, _ := os.ReadDir(cfg.BackupDir); len(entries) != 0 {
		t.Fatalf("a new database was backed up: %d files", len(entries))
	}

	second := append(first, sqlite.Migration{Version: 2, SQL: "ALTER TABLE items ADD COLUMN name TEXT"})
	db, err = openDatabase(context.Background(), cfg, second, discardLogger())
	if err != nil {
		t.Fatalf("second openDatabase() error = %v", err)
	}
	defer db.Close()

	version, err := sqlite.CurrentSchemaVersion(context.Background(), db)
	if err != nil {
		t.Fatalf("CurrentSchemaVersion() error = %v", err)
	}
	if version != 2 {
		t.Fatalf("schema version = %d, want 2", version)
	}
	entries, err := os.ReadDir(cfg.BackupDir)
	if err != nil {
		t.Fatalf("ReadDir(backups) error = %v", err)
	}
	if len(entries) != 1 {
		t.Fatalf("backups = %d, want 1 before migrating an existing schema", len(entries))
	}
}

func discardLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(io.Discard, nil))
}
