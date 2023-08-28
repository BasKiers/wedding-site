import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeGiftSuggestionFields {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    image?: EntryFieldTypes.AssetLink;
}

export type TypeGiftSuggestionSkeleton = EntrySkeletonType<TypeGiftSuggestionFields, "giftSuggestion">;
export type TypeGiftSuggestion<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGiftSuggestionSkeleton, Modifiers, Locales>;

export function isTypeGiftSuggestion<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeGiftSuggestion<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'giftSuggestion'
}
