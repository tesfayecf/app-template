# Workflow: add an API endpoint

Conventions behind these steps: [`conventions.md`](../memory/conventions.md#go-server),
[decision 0001](../decisions/0001-go-api-on-the-standard-library.md).

1. Pick the path under `/api/` and the method. Register it in `server/internal/httpapi/` with a
   method-and-path pattern (`mux.HandleFunc("GET /api/<thing>", ...)`). Group related routes in a
   `register<Thing>Routes(mux)` function called from `NewServer`, as `registerHealthRoutes` is.
2. Read request bodies with `DecodeJSON` (it writes the 400 itself and returns `false`); answer with
   `WriteJSON` or `WriteError`. Keep domain logic out of the handler: put it in its own package under
   `server/internal/` and call it.
3. If the handler needs a setting, add it to `config.Config` and `config.Load` with a default, and to
   `server/.env.example`.
4. Add a test beside the code using `httptest` against `NewServer(...).Handler`, as
   `TestNewServerHealthEndpoints` in `server/internal/httpapi/server_test.go` does. Cover the success
   path and at least one rejected input.
5. Run `(cd server && go vet ./... && go test ./...)`.
6. If the frontend uses it, follow [add-a-frontend-feature.md](add-a-frontend-feature.md) for the
   service and query keys.
7. Update [`ARCHITECTURE.md`](../../ARCHITECTURE.md) if the endpoint adds a component or a flow.
