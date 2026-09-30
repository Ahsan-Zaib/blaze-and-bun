<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Blaze & Bun architecture
- Demo domain data lives in `src/data/*` (typed to mirror a future DB schema) so pages can swap to real APIs without UI changes.
- All cart/branch/order/loyalty state goes through `src/lib/store.tsx` (localStorage-backed); components never touch storage directly.
