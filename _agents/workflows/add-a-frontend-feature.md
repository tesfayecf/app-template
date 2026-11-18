# Workflow: add a frontend feature

Conventions behind these steps: [`app/docs/api-conventions.md`](../../app/docs/api-conventions.md),
[decision 0003](../decisions/0003-frontend-feature-slices-and-api-layers.md). The `health` feature in
`app/src/features/health/` is the reference example.

1. Create `app/src/features/<name>/`.
2. Add `<name>.service.ts`: one function per endpoint calling `apiRequest` from
   `shared/api/client.ts`, with the path and the response type. Accept an `AbortSignal` and pass it on.
3. Add `<name>.keys.ts`: the TanStack Query keys for the feature, built from one root key.
4. Add the page or components (`<Name>Page.tsx`). Use `useQuery`/`useMutation` with the service and
   keys; never build a URL in a component. After a mutation, invalidate the narrowest affected key.
5. Register the route in `app/src/app/router.tsx`. `app/src/app/AppShell.tsx` has no navigation
   yet; add links there when a second page exists.
6. Move code to `app/src/shared/` only when a second feature needs it.
7. Run `pnpm --dir app typecheck` and `pnpm --dir app exec vite build`, then open the page with
   `./cmd/dev.sh` and check it works against the real API.
8. For a pull request, attach a screenshot of the page.
