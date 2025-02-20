// components/products/data/product_data.js

const products = [
    {
        id: 1,
        name: "Ragian Full Sleeve T-Shirt",
        categories: ["clothing", "tshirt"],
        price: 100,
        prevPrice: 200,
        discount: 50,
        image: "/images/shop/shop1.jpeg",
        tags: ["NEW"], 
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"], 
        colors:["pink","blue","cream","white"],

      },
      {
        id: 2,
        name: "Kimano Sleeve Top",
        categories: ["clothing", "top"],
        price: 40,
        prevPrice: 60,
        discount: 33,
        image: "/images/shop/shop2.jpeg",
        tags: ["SALE"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],

      },
      {
        id: 3,
        name: "Vintage Dress",
        categories: ["clothing", "dress","t-shirt"],
        price: 150,
        prevPrice: 250,
        discount: 40,
        image: "/images/shop/shop3.jpg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],

      },
      {
        id: 4,
        name: "Floral Swimsuit",
        categories: ["clothing", "swimwear"],
        price: 75,
        prevPrice: 150,
        discount: 50,
        image: "/images/shop/shop4.jpeg",
        tags: ["SALE"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],

      },
      {
        id: 5,
        name: "Partywear Sequin Dress",
        categories: ["clothing", "dress", "partywear"],
        price: 120,
        prevPrice: 240,
        discount: 50,
        image: "/images/shop/shop5.jpg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],

      },
      {
        id: 6,
        name: "Casual T-shirt",
        categories: ["clothing", "tshirt"],
        price: 30,
        prevPrice: 60,
        discount: 50,
        image: "/images/shop/shop6.jpeg",
        tags: ["SALE"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],

      },
      {
        id: 7,
        name: "Chic Party Dress",
        categories: ["clothing", "dress", "partywear"],
        price: 100,
        prevPrice: 200,
        discount: 50,
        image: "/images/shop/shop7.jpeg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],
      },
      {
        id: 8,
        name: "Chic Party Dress",
        categories: ["clothing", "dress", "partywear"],
        price: 100,
        prevPrice: 200,
        discount: 50,
        image: "/images/shop/shop8.jpg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],
      },
      {
        id: 9,
        name: "Chic Party Dress",
        categories: ["clothing", "dress", "partywear"],
        price: 100,
        prevPrice: 200,
        discount: 50,
        image: "/images/shop/shop9.jpg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],
      },
      {
        id: 10,
        name: "Chic Party Dress",
        categories: ["clothing", "dress", "partywear"],
        price: 100,
        prevPrice: 200,
        discount: 50,
        image: "/images/shop/shop10.jpg",
        tags: ["NEW"],
        description:
          "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
        additionalImages: [
          "/images/shop/additional1.jpg",
          "/images/shop/additional2.jpg",
        ],
        specifications: "Product specifications go here.",
        reviews: [
          { id: 1, rating: 5, text: "Amazing product!", image: "/images/review/review1.png" },
          { id: 2, rating: 4, text: "Good value for money.", image: "/images/review/review2.png" },
        ],
        sizes:["X","M","L","XL"],
        colors:["pink","blue","cream","white"],
      },
  ];

  
  
  export default products;
  