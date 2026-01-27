import type { Author, AuthorId } from "./types";

export const DEFAULT_AVATAR = "/logo.webp";

export const authors: Record<AuthorId, Author> = {
  mahzazel: {
    name: "Mahzazel",
    github: "mathiasdotdev",
    role: "Responsable Rush Royale",
  },
  perpi: {
    name: "Perpi lyonnais",
    github: "mathiasdotdev",
    role: "Responsable Rush Royale",
  },
};
