export type MediaRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  caption: string;
  altText: string;
  mediaType: string;
  mimeType: string;
  fileSize: number;
  storageBucket: string;
  storagePath: string;
  thumbnailStoragePath: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  approximateDate: string;
  datePrecision: string;
  location: string;
  peopleShown: string[];
  source: string;
  copyrightOwner: string;
  licence: string;
  verificationStatus: string;
  moderationStatus: string;
  visibility: string;
  publicationStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  archivedAt: string;
  albumId?: string;
  albumTitle?: string;
  signedUrl?: string;
};

export type MediaAlbum = {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  visibility: string;
  publicationStatus: string;
  coverMediaId: string;
  itemCount: number;
};

export type MediaAlbumItem = {
  id: string;
  albumId: string;
  mediaItemId: string;
  title: string;
  mediaType: string;
  sortOrder: number;
};

export type MediaRelationOption = {
  id: string;
  title: string;
  mediaType: string;
};

export type MediaRelationState = {
  featuredMediaId: string;
  relatedMediaIds: string[];
};
