// =============================================
// PRODUCT CATALOG
// Single source of truth for product data.
// Each product has a permanent id -- never reuse or
// renumber an id, even if a product is removed later,
// so old links/search-engine listings don't break.
// =============================================
const PRODUCTS = [
  { id: 1, name: "Gown Collection Piece 1", price: 35000, img: "images/Hadar Collection 2.jpg", category: "gowns" },
  { id: 2, name: "Gown Collection Piece 2", price: 65000, img: "images/2piece5.jpeg", category: "gowns" },
  { id: 3, name: "Gown Collection Piece 3", price: 70000, img: "images/Gown Collection.png", category: "gowns" },
  { id: 4, name: "Gown Collection Piece 4", price: 60000, img: "images/Theresa-8.jpg", category: "gowns" },
  { id: 5, name: "Hadar Collection Piece 1", price: 70000, img: "images/Hadar Collection1.PNG", category: "hadar" },
  { id: 6, name: "Hadar Collection Piece 2", price: 40000, img: "images/Hadar Collection3.jpg", category: "hadar" },
  { id: 7, name: "Hadar Collection Piece 3", price: 80000, img: "images/Hadar Collection7.jpg", category: "hadar" },
  { id: 8, name: "Hadar Collection Piece 4", price: 85000, img: "images/Hadar Collection8.jpg", category: "hadar" },
  { id: 9, name: "Hadar Collection Piece 5", price: 70000, img: "images/Hadar Collection 9.jpg", category: "hadar" },
  { id: 10, name: "Hadar Collection Piece 6", price: 70000, img: "images/Hadar2piece.jpg", category: "hadar" },
  { id: 11, name: "Hadar Collection Piece 7", price: 70000, img: "images/Hadar2.jpg", category: "hadar" },
  { id: 12, name: "Hadar Collection Piece 8", price: 50000, img: "images/HadarCollection12.jpeg", category: "hadar" },
  { id: 13, name: "Bridal Collection Piece 1", price: 400000, img: "images/bridal collection (2).jpg", category: "bridal" },
  { id: 14, name: "Bridal Collection Piece 2", price: 600000, img: "images/chi.png", category: "bridal" },
  { id: 15, name: "Bridal Collection Piece 3", price: 250000, img: "images/BridalCollection5.png", category: "bridal" },
  { id: 16, name: "Bridal Collection Piece 4", price: 70000, img: "images/BridalCollection3.png", category: "bridal" },
  { id: 17, name: "Bridal Collection Piece 5", price: 150000, img: "images/BridalCollection4.png", category: "bridal" },
  { id: 18, name: "Aso Ebi Collection Piece 1", price: 250000, img: "images/AsoEbiCollection1a.png", category: "aso-ebi" },
  { id: 19, name: "Aso Ebi Collection Piece 2", price: 250000, img: "images/AsoEbicollection3.png", category: "aso-ebi" },
  { id: 20, name: "Aso Ebi Collection Piece 3", price: 250000, img: "images/AsoEbiCollection2.png", category: "aso-ebi" },
  { id: 21, name: "2 Piece Collection Piece 1", price: 15000, img: "images/Hadar Collection5.jpg", category: "2-piece" },
  { id: 22, name: "2 Piece Collection Piece 2", price: 20000, img: "images/Hadar Collection6.jpg", category: "2-piece" },
  { id: 23, name: "2 Piece Collection Piece 3", price: 35000, img: "images/2pieceCollection2.png", category: "2-piece" },
  { id: 24, name: "2 Piece Collection Piece 4", price: 25000, img: "images/2piece.jpg", category: "2-piece" },
  { id: 25, name: "2 Piece Collection Piece 5", price: 35000, img: "images/piece2.jpg", category: "2-piece" },
  { id: 26, name: "2 Piece Collection Piece 6", price: 20000, img: "images/2piece4.jpeg", category: "2-piece" },
  { id: 27, name: "Pearl Collection Piece 1", price: 40000, img: "images/Hadar collection4.jpg", category: "pearl" },
  { id: 28, name: "Pearl Collection Piece 2", price: 60000, img: "images/Hadar Collection 10.jpg", category: "pearl" },
  { id: 29, name: "Pearl Collection Piece 3", price: 45000, img: "images/HadarCollection11hover.jpg", category: "pearl" },
];

function getProductById(id) {
  return PRODUCTS.find(p => String(p.id) === String(id));
}
