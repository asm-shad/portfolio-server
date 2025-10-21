"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
const generateSlug = (text) => {
    const base = text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return base || `item-${Math.random().toString(36).slice(2, 8)}`;
};
exports.generateSlug = generateSlug;
