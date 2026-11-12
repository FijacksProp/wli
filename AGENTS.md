## Project rules

- All site copy, programs, services, resources and team entries live in `src/lib/content.ts`; pages render from it so approved content can be swapped in one place.
- Unconfirmed facts are written as bracketed `[... to be supplied/confirmed]` strings and rendered through `Copy`/`Ph`/`ImagePlaceholder` so they stay visibly marked until replaced.
- Forms are frontend prototypes: validation rules live in `src/lib/validation.ts`; never imply a live backend in UI copy until one is wired.
- Do not edit generated files.
