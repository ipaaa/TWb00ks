
import { Book } from '../types';

export const getBookCoverUrl = (book: Book): string => {
    // Pattern to extract product ID from books.com.tw product links
    const productUrlPattern = /https?:\/\/www\.books\.com\.tw\/products\/(\w+)/;

    if (book.links?.books) {
        const match = book.links.books.match(productUrlPattern);

        if (match && match[1]) {
            const productId = match[1];
            // Construct the image URL based on the known pattern
            // Pattern: https://www.books.com.tw/img/[ID first 3]/[ID next 3]/[ID next 2]/[Full ID].jpg
            // Example: 0010910448 -> 001/091/04/0010910448.jpg

            if (productId.length >= 8) {
                const part1 = productId.substring(0, 3);
                const part2 = productId.substring(3, 6);
                const part3 = productId.substring(6, 8);
                return `https://www.books.com.tw/img/${part1}/${part2}/${part3}/${productId}.jpg`;
            }
        } else {
            // Only warn if it's a books.com.tw link but not a product page (e.g. search page)
            // and we don't have a manual cover image, OR if we want to encourage fixing links.
            // For now, let's warn if it looks like a search link so we know which ones to fix.
            if (book.links.books.includes('search')) {
                console.warn(`Book '${book.title}' has a search URL instead of a product URL. Cannot automatically derive cover.`);
            }
        }
    }

    // Fallback to the manually provided cover image or a default placeholder if needed
    // transform google books image to https
    if (book.coverImage?.startsWith('http://')) {
        return book.coverImage.replace('http://', 'https://');
    }

    return book.coverImage || 'https://images.unsplash.com/photo-1544648156-5388451882c5?q=80&w=400';
};
