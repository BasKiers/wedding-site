import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeGiftSuggestionSkeleton } from "./TypeGiftSuggestion";

export interface TypeGiftSuggestionCategoryFields {
    name: EntryFieldTypes.Symbol;
    order: EntryFieldTypes.Integer;
    suggestions: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGiftSuggestionSkeleton>>;
}

export type TypeGiftSuggestionCategorySkeleton = EntrySkeletonType<TypeGiftSuggestionCategoryFields, "giftSuggestionCategory">;
export type TypeGiftSuggestionCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGiftSuggestionCategorySkeleton, Modifiers, Locales>;

export function isTypeGiftSuggestionCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGiftSuggestionCategory<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'giftSuggestionCategory'
}
