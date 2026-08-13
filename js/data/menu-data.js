/*
 * Full real menu of "A Cultura do Hambúrguer" — prices, ingredients and
 * categories are exactly as supplied by the restaurant. Descriptions are
 * faithful PT/EN/ES translations of the real ingredient lists — nothing
 * invented. `allergens: null` means the restaurant has not yet supplied
 * allergen data; the UI renders an honest "to confirm" note wherever null.
 */
window.MENU_DATA = [
  {
    id: "petiscos",
    name: { pt: "Petiscos", en: "Starters", es: "Aperitivos" },
    items: [
      {
        id: "cascas-batata",
        name: "Cascas de Batata",
        price: "4,55€",
        description: {
          pt: "Servido com Molho Tártaro.",
          en: "Served with tartar sauce.",
          es: "Servido con salsa tártara.",
        },
        allergens: null,
      },
      {
        id: "mini-cascas-batata",
        name: "Mini Cascas de Batata",
        price: "2,95€",
        description: {
          pt: "Servido com Molho Tártaro.",
          en: "Served with tartar sauce.",
          es: "Servido con salsa tártara.",
        },
        allergens: null,
      },
      {
        id: "batatas-fritas",
        name: "Batatas Fritas",
        price: "2,75€",
        description: {
          pt: "Servidas com maionese de alho.",
          en: "Served with garlic mayo.",
          es: "Servidas con mayonesa de ajo.",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "hamburgueres",
    name: { pt: "Hambúrgueres", en: "Burgers", es: "Hamburguesas" },
    note: {
      pt: "Acompanhados de batata frita e maionese caseira. Carne 160g, 100% novilho.",
      en: "Served with fries and homemade mayo. 160g patty, 100% young beef.",
      es: "Servidos con patatas fritas y mayonesa casera. Carne 160g, 100% ternera.",
    },
    items: [
      {
        id: "new-york",
        name: "New York",
        price: "10,75€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Queijo Cheddar, Tomate, Alface, Maionese de Alho",
          en: "Burger bun, beef patty with cheddar cheese, tomato, lettuce, garlic mayo",
          es: "Pan de hamburguesa, hamburguesa con queso cheddar, tomate, lechuga, mayonesa de ajo",
        },
        allergens: null,
      },
      {
        id: "salgadeiras",
        name: "Salgadeiras",
        badge: "bestseller",
        price: "11,95€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Queijo Manchego, Bacon Crocante, Cebola Caramelizada, Tomate, Maionese de Manjericão",
          en: "Burger bun, beef patty with manchego cheese, crispy bacon, caramelized onion, tomato, basil mayo",
          es: "Pan de hamburguesa, hamburguesa con queso manchego, bacon crujiente, cebolla caramelizada, tomate, mayonesa de albahaca",
        },
        allergens: null,
      },
      {
        id: "amalia",
        name: "Amália",
        price: "12,65€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Queijo Emmental, Tomate Cherry Assado, Bacon Frito, Sour Cream, Ananás",
          en: "Burger bun, beef patty with emmental cheese, roasted cherry tomato, fried bacon, sour cream, pineapple",
          es: "Pan de hamburguesa, hamburguesa con queso emmental, tomate cherry asado, bacon frito, sour cream, piña",
        },
        allergens: null,
      },
      {
        id: "lx",
        name: "LX",
        price: "11,75€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Queijo Gorgonzola, Salame Picante, Cebola Confitada, Agrião, Tomate, Molho Tártaro",
          en: "Burger bun, beef patty with gorgonzola cheese, spicy salami, confit onion, watercress, tomato, tartar sauce",
          es: "Pan de hamburguesa, hamburguesa con queso gorgonzola, salami picante, cebolla confitada, berro, tomate, salsa tártara",
        },
        allergens: null,
      },
      {
        id: "eusebio",
        name: "Eusébio",
        price: "12,65€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Maionese de Abacate, Cebola Roxa, Cebola Crua, Presunto Frito, Pimentos Vermelhos Assados, Molho Tártaro",
          en: "Burger bun, beef patty with avocado mayo, red onion, raw onion, fried cured ham, roasted red peppers, tartar sauce",
          es: "Pan de hamburguesa, hamburguesa con mayonesa de aguacate, cebolla morada, cebolla cruda, jamón curado frito, pimientos rojos asados, salsa tártara",
        },
        allergens: null,
      },
      {
        id: "tudo-ao-molho",
        name: "Tudo ao Molho",
        price: "11,85€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Queijo Cheddar, Ovo Estrelado, Presunto, Cogumelos, Tomate, Alface, Maionese",
          en: "Burger bun, beef patty with cheddar cheese, fried egg, cured ham, mushrooms, tomato, lettuce, mayo",
          es: "Pan de hamburguesa, hamburguesa con queso cheddar, huevo frito, jamón curado, champiñones, tomate, lechuga, mayonesa",
        },
        allergens: null,
      },
      {
        id: "vegetariano",
        name: "Vegetariano",
        price: "10,95€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer de Beterraba, Feijão Preto e Arroz, Queijo Cheddar, Alface Iceberg, Maionese de Alho",
          en: "Burger bun, beetroot patty, black beans and rice, cheddar cheese, iceberg lettuce, garlic mayo",
          es: "Pan de hamburguesa, hamburguesa de remolacha, frijoles negros y arroz, queso cheddar, lechuga iceberg, mayonesa de ajo",
        },
        allergens: null,
      },
      {
        id: "chourico-picante",
        name: "Chouriço Picante",
        price: "12,95€",
        description: {
          pt: "Pão de Hambúrguer, Hambúrguer com Chouriço e Malagueta, Queijo da Serra, Ovo Estrelado, Cebola Confitada, Agrião, Maionese de Pimentos Vermelhos",
          en: "Burger bun, beef patty with spicy chorizo, Serra cheese, fried egg, confit onion, watercress, red pepper mayo",
          es: "Pan de hamburguesa, hamburguesa con chorizo picante, queso da Serra, huevo frito, cebolla confitada, berro, mayonesa de pimientos rojos",
        },
        allergens: null,
      },
      {
        id: "no10-aniversario",
        name: "Nº 10 — Aniv. 10 Anos",
        price: "12,55€",
        description: {
          pt: "Pão de Hambúrguer Brioche, Hambúrguer com Queijo Emmental, Couve Roxa, Cebola Roxa Frita, Bacon Fino, Molho Tártaro, Picles",
          en: "Brioche burger bun, beef patty with emmental cheese, red cabbage, fried red onion, thin-cut bacon, tartar sauce, pickles",
          es: "Pan de hamburguesa brioche, hamburguesa con queso emmental, col morada, cebolla morada frita, bacon fino, salsa tártara, pepinillos",
        },
        allergens: null,
      },
      {
        id: "hamburguer-extra",
        name: "Hambúrguer Extra",
        price: "3,95€",
        allergens: null,
      },
    ],
  },
  {
    id: "smash-burger",
    name: { pt: "Smash Burger", en: "Smash Burger", es: "Smash Burger" },
    items: [
      {
        id: "old-school",
        name: "Old School",
        price: "9,95€",
        description: {
          pt: "Sem batatas fritas. 100g de Carne de Vaca de Novilho Smashed, Pão de Hambúrguer Brioche, Molho Especial, Queijo Cheddar, Abacate, Cebola, Bacon",
          en: "No fries included. 100g smashed young-beef patty, brioche burger bun, special sauce, cheddar cheese, avocado, onion, bacon",
          es: "Sin patatas fritas. 100g de carne de ternera smashed, pan de hamburguesa brioche, salsa especial, queso cheddar, aguacate, cebolla, bacon",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "saladas",
    name: { pt: "Saladas", en: "Salads", es: "Ensaladas" },
    items: [
      {
        id: "mediterranica",
        name: "Mediterrânica",
        price: "9,95€",
        description: {
          pt: "Mistura de Alfaces, Tomate Cherry, Azeitonas, Mozzarella Fresca, Abacate, Vinagre Balsâmico Creme, Molho de Iogurte e Manjericão",
          en: "Mixed lettuces, cherry tomato, olives, fresh mozzarella, avocado, balsamic cream, yogurt and basil dressing",
          es: "Mezcla de lechugas, tomate cherry, aceitunas, mozzarella fresca, aguacate, crema de vinagre balsámico, salsa de yogur y albahaca",
        },
        allergens: null,
      },
      {
        id: "caesar",
        name: "Caesar",
        price: "10,95€",
        description: {
          pt: "Alface, Peito de Frango Grelhado, Croutons, Bacon Crocante, Lascas de Queijo Parmesão, Molho Caesar",
          en: "Lettuce, grilled chicken breast, croutons, crispy bacon, shaved parmesan, Caesar dressing",
          es: "Lechuga, pechuga de pollo a la plancha, croutons, bacon crujiente, virutas de queso parmesano, salsa Caesar",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "pregos",
    name: { pt: "Pregos", en: "Pregos", es: "Pregos" },
    note: {
      pt: "Acompanhados de batata frita e maionese caseira, servidos em Bolo do Caco.",
      en: "Portuguese steak rolls, served with fries, homemade mayo, on Bolo do Caco bread.",
      es: "Bocadillos de bistec, servidos con patatas fritas, mayonesa casera, en pan Bolo do Caco.",
    },
    items: [
      {
        id: "bairro-alto",
        name: "Bairro Alto",
        price: "11,95€",
        description: {
          pt: "Bolo do Caco, Mostarda Dijon",
          en: "Bolo do Caco bread, Dijon mustard",
          es: "Pan Bolo do Caco, mostaza Dijon",
        },
        allergens: null,
      },
      {
        id: "da-cultura",
        name: "Da Cultura",
        price: "12,95€",
        description: {
          pt: "Bolo do Caco, Queijo Manchego, Pancetta Frita, Maionese de Manjericão",
          en: "Bolo do Caco bread, Manchego cheese, fried pancetta, basil mayo",
          es: "Pan Bolo do Caco, queso Manchego, panceta frita, mayonesa de albahaca",
        },
        allergens: null,
      },
      {
        id: "camoes",
        name: "Camões",
        price: "12,95€",
        description: {
          pt: "Bolo do Caco da Ilha, Tomate Cherry Confitado, Rúcula, Maionese de Alho",
          en: "Ilha-style Bolo do Caco bread, confit cherry tomato, arugula, garlic mayo",
          es: "Pan Bolo do Caco estilo Ilha, tomate cherry confitado, rúcula, mayonesa de ajo",
        },
        allergens: null,
      },
      {
        id: "de-frango",
        name: "De Frango",
        price: "10,95€",
        description: {
          pt: "Bolo do Caco, Peito de Frango Grelhado, Bacon Crocante, Molho Caesar, Queijo Parmesão",
          en: "Bolo do Caco bread, grilled chicken breast, crispy bacon, Caesar dressing, parmesan cheese",
          es: "Pan Bolo do Caco, pechuga de pollo a la plancha, bacon crujiente, salsa Caesar, queso parmesano",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "sobremesas",
    name: { pt: "Sobremesas", en: "Desserts", es: "Postres" },
    items: [
      {
        id: "tarte-lima",
        name: "Tarte de Lima",
        price: "4,85€",
        description: {
          pt: "Tarte Caseira, Miami Style, Chantilly de Limão",
          en: "Homemade tart, Miami style, lime whipped cream",
          es: "Tarta casera, estilo Miami, chantillí de lima",
        },
        allergens: null,
      },
      {
        id: "mousse-chocolate",
        name: "Mousse de Chocolate",
        price: "4,65€",
        allergens: null,
      },
      {
        id: "bolo-chocolate",
        name: "Bolo de Chocolate",
        price: "4,85€",
        description: {
          pt: "Bolo de Chocolate Caseiro",
          en: "Homemade chocolate cake",
          es: "Bizcocho de chocolate casero",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "maioneses-extras",
    name: { pt: "Maioneses / Extras", en: "Mayonnaises / Extras", es: "Mayonesas / Extras" },
    items: [
      {
        id: "maionese-extra",
        name: "Maionese Extra",
        price: "0,60€",
        description: {
          pt: "Sabores: Pimentos Vermelhos, Manjericão, Alho, Molho Tártaro, Barbecue, Beringela",
          en: "Flavors: red pepper, basil, garlic, tartar, barbecue, eggplant",
          es: "Sabores: pimientos rojos, albahaca, ajo, tártara, barbacoa, berenjena",
        },
        allergens: null,
      },
      { id: "ketchup", name: "Ketchup", price: "0,20€", allergens: null },
    ],
  },
  {
    id: "limonadas",
    name: { pt: "Limonadas", en: "Lemonades", es: "Limonadas" },
    items: [
      { id: "limonada-lima", name: "Lima", price: "3,90€", allergens: null },
      { id: "limonada-frutos-vermelhos", name: "Frutos Vermelhos", price: "3,90€", allergens: null },
    ],
  },
  {
    id: "cocktails",
    name: { pt: "Cocktails", en: "Cocktails", es: "Cócteles" },
    items: [
      {
        id: "basilic-gin-fizz",
        name: "Basilic Gin Fizz",
        price: "8,90€",
        description: {
          pt: "Gin Fizz intensamente envolvido em manjericão e gengibre.",
          en: "Gin Fizz intensely infused with basil and ginger.",
          es: "Gin Fizz intensamente envuelto en albahaca y jengibre.",
        },
        allergens: null,
      },
      {
        id: "covenant-sparrow",
        name: "Covenant Sparrow",
        price: "8,90€",
        description: {
          pt: "Rum envelhecido com maracujá e casca de laranja amarga e angostura bitters.",
          en: "Aged rum with passion fruit, bitter orange peel and angostura bitters.",
          es: "Ron añejo con maracuyá, cáscara de naranja amarga y angostura bitters.",
        },
        allergens: null,
      },
      {
        id: "gin-da-cultura",
        name: "Gin da Cultura",
        price: "8,90€",
        description: {
          pt: "Gin da casa com limonada de frutos vermelhos.",
          en: "House gin with red berry lemonade.",
          es: "Ginebra de la casa con limonada de frutos rojos.",
        },
        allergens: null,
      },
      {
        id: "moscow-mule",
        name: "Moscow Mule",
        price: "8,90€",
        description: {
          pt: "Vodka, sumo de lima, espuma de gengibre e raspas de lima.",
          en: "Vodka, lime juice, ginger foam and lime zest.",
          es: "Vodka, zumo de lima, espuma de jengibre y ralladura de lima.",
        },
        allergens: null,
      },
      {
        id: "caipirinha",
        name: "Caipirinha",
        price: "8,50€",
        description: {
          pt: "Cachaça 51, lima e açúcar castanho líquido.",
          en: "Cachaça 51, lime and liquid brown sugar.",
          es: "Cachaça 51, lima y azúcar moreno líquido.",
        },
        allergens: null,
      },
      {
        id: "mojito",
        name: "Mojito",
        price: "8,50€",
        description: {
          pt: "Rum, lima, açúcar líquido, hortelã fresca e água gaseificada.",
          en: "Rum, lime, liquid sugar, fresh mint and soda water.",
          es: "Ron, lima, azúcar líquido, menta fresca y agua con gas.",
        },
        allergens: null,
      },
      {
        id: "margarita",
        name: "Margarita",
        price: "8,50€",
        description: {
          pt: "Tequila, sumo de limão e licor de laranja.",
          en: "Tequila, lemon juice and orange liqueur.",
          es: "Tequila, zumo de limón y licor de naranja.",
        },
        allergens: null,
      },
      {
        id: "aperol-spritz",
        name: "Aperol Spritz",
        price: "8,50€",
        description: {
          pt: "Aperol, Prosecco, club soda e casca de laranja.",
          en: "Aperol, Prosecco, club soda and orange peel.",
          es: "Aperol, Prosecco, club soda y cáscara de naranja.",
        },
        allergens: null,
      },
      {
        id: "expresso-martini",
        name: "Expresso Martini",
        price: "8,50€",
        description: {
          pt: "Café expresso, licor de café e vodka.",
          en: "Espresso coffee, coffee liqueur and vodka.",
          es: "Café espresso, licor de café y vodka.",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "gins",
    name: { pt: "Gins", en: "Gins", es: "Ginebras" },
    items: [
      { id: "hendricks", name: "Hendrick's", price: "11,00€", allergens: null },
      { id: "tanqueray", name: "Tanqueray", price: "8,00€", allergens: null },
    ],
  },
  {
    id: "bebidas",
    name: { pt: "Bebidas", en: "Soft Drinks", es: "Bebidas" },
    items: [
      { id: "agua-50cl", name: "Água 0,50cl", price: "2,10€", allergens: null },
      { id: "agua-castelo-25cl", name: "Água Castelo 0,25cl", price: "1,70€", allergens: null },
      {
        id: "coca-cola",
        name: "Coca-Cola",
        price: "3,10€",
        variantNote: {
          pt: "Normal ou Zero",
          en: "Regular or Zero",
          es: "Normal o Zero",
        },
        allergens: null,
      },
      { id: "7up", name: "7UP", price: "3,10€", allergens: null },
      {
        id: "arizona-iced-tea",
        name: "Arizona Iced Tea",
        price: "3,75€",
        variantNote: {
          pt: "Limão, Pêssego ou Chá Verde",
          en: "Lemon, Peach or Green Tea",
          es: "Limón, Melocotón o Té Verde",
        },
        allergens: null,
      },
      { id: "cafe", name: "Café", price: "1,20€", allergens: null },
    ],
  },
  {
    id: "cervejas",
    name: { pt: "Cervejas", en: "Beers", es: "Cervezas" },
    items: [
      {
        id: "sagres",
        name: "Sagres",
        variants: [
          { label: "20cl", price: "2,50€" },
          { label: "48cl", price: "4,90€" },
        ],
        allergens: null,
      },
      {
        id: "heineken",
        name: "Heineken",
        variants: [
          { label: "25cl", price: "2,95€" },
          { label: "50cl", price: "5,40€" },
        ],
        allergens: null,
      },
      {
        id: "guinness",
        name: "Guinness",
        variants: [
          { label: "25cl", price: "4,70€" },
          { label: "50cl", price: "7,90€" },
        ],
        allergens: null,
      },
      {
        id: "bandida",
        name: "Bandida",
        price: "3,95€",
        description: { pt: "Sidra · 40cl", en: "Cider · 40cl", es: "Sidra · 40cl" },
        allergens: null,
      },
      {
        id: "corona",
        name: "Corona",
        price: "4,55€",
        description: { pt: "35cl · Garrafa", en: "35cl · Bottle", es: "35cl · Botella" },
        allergens: null,
      },
      {
        id: "heineken-00",
        name: "Heineken 0.0",
        price: "2,95€",
        description: {
          pt: "Sem Álcool · 25cl · Garrafa",
          en: "Alcohol-free · 25cl · Bottle",
          es: "Sin Alcohol · 25cl · Botella",
        },
        allergens: null,
      },
      {
        id: "trindade-ipa",
        name: "Trindade Artesanal IPA",
        variants: [
          { label: "30cl", price: "5,30€" },
          { label: "50cl", price: "7,70€" },
        ],
        allergens: null,
      },
    ],
  },
  {
    id: "outras-bebidas",
    name: { pt: "Outras Bebidas", en: "Other Drinks", es: "Otras Bebidas" },
    items: [
      { id: "ginja", name: "Ginja", price: "4,00€ / Shot", allergens: null },
      { id: "licor-beirao", name: "Licor Beirão", price: "5,00€ / 4,00€", allergens: null },
      { id: "tequila", name: "Tequila", price: "4,00€ / Shot", allergens: null },
      { id: "jameson", name: "Jameson", price: "7,00€ / Copo", allergens: null },
      { id: "jack-daniels", name: "Jack Daniel's", price: "8,00€ / Copo", allergens: null },
      {
        id: "vinho-porto",
        name: "Vinho do Porto",
        price: "5,50€ / Copo",
        variantNote: { pt: "Branco ou Tinto", en: "White or Red", es: "Blanco o Tinto" },
        allergens: null,
      },
    ],
  },
  {
    id: "vinhos-tintos",
    name: { pt: "Vinhos Tintos", en: "Red Wines", es: "Vinos Tintos" },
    items: [
      { id: "ea-cartuxa", name: "E.A. Cartuxa", price: "4,70€ / 15,90€", region: "Alentejo", allergens: null },
      { id: "duque-de-viseu", name: "Duque de Viseu", price: "4,70€ / 15,90€", region: "Dão", allergens: null },
      { id: "esteva", name: "Esteva", price: "4,40€ / 14,90€", region: "Douro", allergens: null },
    ],
  },
  {
    id: "vinhos-brancos",
    name: { pt: "Vinhos Brancos", en: "White Wines", es: "Vinos Blancos" },
    items: [
      { id: "monte-velho", name: "Monte Velho", price: "3,90€ / 13,80€", region: "Alentejo", allergens: null },
      {
        id: "fiuza-sauvignon-blanc",
        name: "Fiuza Sauvignon Blanc",
        price: "4,90€ / 15,90€",
        region: "Lisboa",
        allergens: null,
      },
    ],
  },
  {
    id: "vinho-rose",
    name: { pt: "Vinho Rosé", en: "Rosé Wine", es: "Vino Rosado" },
    items: [{ id: "rose", name: "Rosé", price: "3,90€ / 13,90€", allergens: null }],
  },
  {
    id: "vinho-verde",
    name: { pt: "Vinho Verde", en: "Vinho Verde", es: "Vinho Verde" },
    items: [
      { id: "muralhas-de-moncao", name: "Muralhas de Monção", price: "14,90€", region: "Minho", allergens: null },
    ],
  },
  {
    id: "sangrias",
    name: { pt: "Sangrias", en: "Sangrias", es: "Sangrías" },
    items: [
      { id: "sangria-tinta", name: "Tinta", price: "14,90€", allergens: null },
      { id: "sangria-branca", name: "Branca", price: "14,90€", allergens: null },
    ],
  },
];
