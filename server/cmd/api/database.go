package main

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"

	"example.com/app-template/server/internal/config"
	"example.com/app-template/server/internal/sqlite"
)

// appMigrations is the product schema, in strictly increasing version order. The template ships
// none; a product appends its own here.
var appMigrations []sqlite.Migration

// openDatabase opens the optional SQLite database, refuses a database that fails its integrity
// check, backs it up before applying pending migrations, and migrates it. It returns nil when
// SQLITE_PATH is unset.
func openDatabase(ctx context.Context, cfg config.DatabaseConfig, migrations []sqlite.Migration, logger *slog.Logger) (*sql.DB, error) {
	if !cfg.Enabled {
		return nil, nil
	}

	db, err := sqlite.Open(ctx, sqlite.Config{Path: cfg.Path})
	if err != nil {
		return nil, err
	}

	if err := prepareDatabase(ctx, db, cfg, migrations, logger); err != nil {
		_ = db.Close()
		return nil, err
	}

	return db, nil
}

func prepareDatabase(ctx context.Context, db *sql.DB, cfg config.DatabaseConfig, migrations []sqlite.Migration, logger *slog.Logger) error {
	if err := sqlite.IntegrityCheck(ctx, db); err != nil {
		return err
	}

	version, err := sqlite.CurrentSchemaVersion(ctx, db)
	if err != nil {
		return err
	}

	if hasPendingMigration(migrations, version) && version > 0 {
		backupPath, err := sqlite.BackupDatabase(ctx, db, cfg.BackupDir, version)
		if err != nil {
			return fmt.Errorf("back up before migrating: %w", err)
		}
		logger.Info("sqlite backup written", "path", backupPath, "schema_version", version)
	}

	if err := sqlite.Migrate(ctx, db, migrations); err != nil {
		return err
	}

	current, err := sqlite.CurrentSchemaVersion(ctx, db)
	if err != nil {
		return err
	}
	logger.Info("sqlite database ready", "path", cfg.Path, "schema_version", current)

	return nil
}

func hasPendingMigration(migrations []sqlite.Migration, version int) bool {
	for _, migration := range migrations {
		if migration.Version > version {
			return true
		}
	}

	return false
}
