/*
 * Full real menu of "A Cultura do Hambúrguer" — prices, ingredients and
 * categories are exactly as supplied by the restaurant. Descriptions are
 * faithful PT/EN/ES/FR translations of the real ingredient lists — nothing
 * invented. `allergens: null` means the restaurant has not yet supplied
 * allergen data; the UI renders an honest "to confirm" note wherever null.
 */
window.MENU_DATA = [
  {
    id: "petiscos",
    name: { pt: "Petiscos", en: "Starters", es: "Aperitivos", fr: "Entrées" },
    items: [
      {
        id: "cascas-batata",
        name: "Cascas de Batata",
        price: "4,55€",
        description: {
          pt: "Servido com Molho Tártaro.",
          en: "Served with tartar sauce.",
          es: "Servido con salsa tártara.",
          fr: "Servi avec sauce tartare.",
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
          fr: "Servi avec sauce tartare.",
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
          fr: "Servies avec mayonnaise à l'ail.",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "hamburgueres",
    name: { pt: "Hambúrgueres", en: "Burgers", es: "Hamburguesas", fr: "Burgers" },
    note: {
      pt: "Acompanhados de batata frita e maionese caseira. Carne 160g, 100% novilho.",
      en: "Served with fries and homemade mayo. 160g patty, 100% young beef.",
      es: "Servidos con patatas fritas y mayonesa casera. Carne 160g, 100% ternera.",
      fr: "Servis avec frites et mayonnaise maison. Steak haché 160g, 100% génisse.",
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
          fr: "Pain burger, steak haché avec fromage cheddar, tomate, laitue, mayonnaise à l'ail",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Cheddar", en: "cheddar cheese", es: "queso cheddar", fr: "fromage cheddar" } },
          { required: false, name: { pt: "Tomate", en: "tomato", es: "tomate", fr: "tomate" } },
          { required: false, name: { pt: "Alface", en: "lettuce", es: "lechuga", fr: "laitue" } },
          { required: false, name: { pt: "Maionese de Alho", en: "garlic mayo", es: "mayonesa de ajo", fr: "mayonnaise à l'ail" } },
        ],
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
          fr: "Pain burger, steak haché avec fromage manchego, bacon croustillant, oignon caramélisé, tomate, mayonnaise au basilic",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Manchego", en: "manchego cheese", es: "queso manchego", fr: "fromage manchego" } },
          { required: false, name: { pt: "Bacon Crocante", en: "crispy bacon", es: "bacon crujiente", fr: "bacon croustillant" } },
          { required: false, name: { pt: "Cebola Caramelizada", en: "caramelized onion", es: "cebolla caramelizada", fr: "oignon caramélisé" } },
          { required: false, name: { pt: "Tomate", en: "tomato", es: "tomate", fr: "tomate" } },
          { required: false, name: { pt: "Maionese de Manjericão", en: "basil mayo", es: "mayonesa de albahaca", fr: "mayonnaise au basilic" } },
        ],
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
          fr: "Pain burger, steak haché avec fromage emmental, tomate cerise rôtie, bacon frit, sour cream, ananas",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Emmental", en: "emmental cheese", es: "queso emmental", fr: "fromage emmental" } },
          { required: false, name: { pt: "Tomate Cherry Assado", en: "roasted cherry tomato", es: "tomate cherry asado", fr: "tomate cerise rôtie" } },
          { required: false, name: { pt: "Bacon Frito", en: "fried bacon", es: "bacon frito", fr: "bacon frit" } },
          { required: false, name: { pt: "Sour Cream", en: "sour cream", es: "sour cream", fr: "sour cream" } },
          { required: false, name: { pt: "Ananás", en: "pineapple", es: "piña", fr: "ananas" } },
        ],
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
          fr: "Pain burger, steak haché avec fromage gorgonzola, salami épicé, oignon confit, cresson, tomate, sauce tartare",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Gorgonzola", en: "gorgonzola cheese", es: "queso gorgonzola", fr: "fromage gorgonzola" } },
          { required: false, name: { pt: "Salame Picante", en: "spicy salami", es: "salami picante", fr: "salami épicé" } },
          { required: false, name: { pt: "Cebola Confitada", en: "confit onion", es: "cebolla confitada", fr: "oignon confit" } },
          { required: false, name: { pt: "Agrião", en: "watercress", es: "berro", fr: "cresson" } },
          { required: false, name: { pt: "Tomate", en: "tomato", es: "tomate", fr: "tomate" } },
          { required: false, name: { pt: "Molho Tártaro", en: "tartar sauce", es: "salsa tártara", fr: "sauce tartare" } },
        ],
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
          fr: "Pain burger, steak haché avec mayonnaise à l'avocat, oignon rouge, oignon cru, jambon fumé frit, poivrons rouges rôtis, sauce tartare",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Maionese de Abacate", en: "avocado mayo", es: "mayonesa de aguacate", fr: "mayonnaise à l'avocat" } },
          { required: false, name: { pt: "Cebola Roxa", en: "red onion", es: "cebolla morada", fr: "oignon rouge" } },
          { required: false, name: { pt: "Cebola Crua", en: "raw onion", es: "cebolla cruda", fr: "oignon cru" } },
          { required: false, name: { pt: "Presunto Frito", en: "fried cured ham", es: "jamón curado frito", fr: "jambon fumé frit" } },
          { required: false, name: { pt: "Pimentos Vermelhos Assados", en: "roasted red peppers", es: "pimientos rojos asados", fr: "poivrons rouges rôtis" } },
          { required: false, name: { pt: "Molho Tártaro", en: "tartar sauce", es: "salsa tártara", fr: "sauce tartare" } },
        ],
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
          fr: "Pain burger, steak haché avec fromage cheddar, œuf au plat, jambon fumé, champignons, tomate, laitue, mayonnaise",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Cheddar", en: "cheddar cheese", es: "queso cheddar", fr: "fromage cheddar" } },
          { required: false, name: { pt: "Ovo Estrelado", en: "fried egg", es: "huevo frito", fr: "œuf au plat" } },
          { required: false, name: { pt: "Presunto", en: "cured ham", es: "jamón curado", fr: "jambon fumé" } },
          { required: false, name: { pt: "Cogumelos", en: "mushrooms", es: "champiñones", fr: "champignons" } },
          { required: false, name: { pt: "Tomate", en: "tomato", es: "tomate", fr: "tomate" } },
          { required: false, name: { pt: "Alface", en: "lettuce", es: "lechuga", fr: "laitue" } },
          { required: false, name: { pt: "Maionese", en: "mayo", es: "mayonesa", fr: "mayonnaise" } },
        ],
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
          fr: "Pain burger, steak de betterave, haricots noirs et riz, fromage cheddar, laitue iceberg, mayonnaise à l'ail",
        },
        // The veggie patty itself is beetroot + black beans + rice (two
        // comma segments in the source description) — kept together as one
        // required entry since they're the patty's own composition, not
        // separable toppings.
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          {
            required: true,
            name: {
              pt: "Hambúrguer de Beterraba, Feijão Preto e Arroz",
              en: "beetroot patty, black beans and rice",
              es: "hamburguesa de remolacha, frijoles negros y arroz",
              fr: "steak de betterave, haricots noirs et riz",
            },
          },
          { required: false, name: { pt: "Queijo Cheddar", en: "cheddar cheese", es: "queso cheddar", fr: "fromage cheddar" } },
          { required: false, name: { pt: "Alface Iceberg", en: "iceberg lettuce", es: "lechuga iceberg", fr: "laitue iceberg" } },
          { required: false, name: { pt: "Maionese de Alho", en: "garlic mayo", es: "mayonesa de ajo", fr: "mayonnaise à l'ail" } },
        ],
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
          fr: "Pain burger, steak haché avec chorizo et piment, fromage da Serra, œuf au plat, oignon confit, cresson, mayonnaise au poivron rouge",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer", en: "Burger bun", es: "Pan de hamburguesa", fr: "Pain burger" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Chouriço e Malagueta", en: "spicy chorizo", es: "chorizo picante", fr: "chorizo et piment" } },
          { required: false, name: { pt: "Queijo da Serra", en: "Serra cheese", es: "queso da Serra", fr: "fromage da Serra" } },
          { required: false, name: { pt: "Ovo Estrelado", en: "fried egg", es: "huevo frito", fr: "œuf au plat" } },
          { required: false, name: { pt: "Cebola Confitada", en: "confit onion", es: "cebolla confitada", fr: "oignon confit" } },
          { required: false, name: { pt: "Agrião", en: "watercress", es: "berro", fr: "cresson" } },
          { required: false, name: { pt: "Maionese de Pimentos Vermelhos", en: "red pepper mayo", es: "mayonesa de pimientos rojos", fr: "mayonnaise au poivron rouge" } },
        ],
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
          fr: "Pain burger brioché, steak haché avec fromage emmental, chou rouge, oignon rouge frit, bacon fin, sauce tartare, cornichons",
        },
        ingredients: [
          { required: true, name: { pt: "Pão de Hambúrguer Brioche", en: "Brioche burger bun", es: "Pan de hamburguesa brioche", fr: "Pain burger brioché" } },
          { required: true, name: { pt: "Hambúrguer", en: "beef patty", es: "hamburguesa", fr: "steak haché" } },
          { required: false, name: { pt: "Queijo Emmental", en: "emmental cheese", es: "queso emmental", fr: "fromage emmental" } },
          { required: false, name: { pt: "Couve Roxa", en: "red cabbage", es: "col morada", fr: "chou rouge" } },
          { required: false, name: { pt: "Cebola Roxa Frita", en: "fried red onion", es: "cebolla morada frita", fr: "oignon rouge frit" } },
          { required: false, name: { pt: "Bacon Fino", en: "thin-cut bacon", es: "bacon fino", fr: "bacon fin" } },
          { required: false, name: { pt: "Molho Tártaro", en: "tartar sauce", es: "salsa tártara", fr: "sauce tartare" } },
          { required: false, name: { pt: "Picles", en: "pickles", es: "pepinillos", fr: "cornichons" } },
        ],
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
    name: { pt: "Smash Burger", en: "Smash Burger", es: "Smash Burger", fr: "Smash Burger" },
    items: [
      {
        id: "old-school",
        name: "Old School",
        price: "9,95€",
        description: {
          pt: "Sem batatas fritas. 100g de Carne de Vaca de Novilho Smashed, Pão de Hambúrguer Brioche, Molho Especial, Queijo Cheddar, Abacate, Cebola, Bacon",
          en: "No fries included. 100g smashed young-beef patty, brioche burger bun, special sauce, cheddar cheese, avocado, onion, bacon",
          es: "Sin patatas fritas. 100g de carne de ternera smashed, pan de hamburguesa brioche, salsa especial, queso cheddar, aguacate, cebolla, bacon",
          fr: "Sans frites. 100g de bœuf de génisse smashed, pain burger brioché, sauce spéciale, fromage cheddar, avocat, oignon, bacon",
        },
        ingredients: [
          { required: true, name: { pt: "100g de Carne de Vaca de Novilho Smashed", en: "100g smashed young-beef patty", es: "100g de carne de ternera smashed", fr: "100g de bœuf de génisse smashed" } },
          { required: true, name: { pt: "Pão de Hambúrguer Brioche", en: "brioche burger bun", es: "pan de hamburguesa brioche", fr: "pain burger brioché" } },
          { required: false, name: { pt: "Molho Especial", en: "special sauce", es: "salsa especial", fr: "sauce spéciale" } },
          { required: false, name: { pt: "Queijo Cheddar", en: "cheddar cheese", es: "queso cheddar", fr: "fromage cheddar" } },
          { required: false, name: { pt: "Abacate", en: "avocado", es: "aguacate", fr: "avocat" } },
          { required: false, name: { pt: "Cebola", en: "onion", es: "cebolla", fr: "oignon" } },
          { required: false, name: { pt: "Bacon", en: "bacon", es: "bacon", fr: "bacon" } },
        ],
        allergens: null,
      },
    ],
  },
  {
    id: "saladas",
    name: { pt: "Saladas", en: "Salads", es: "Ensaladas", fr: "Salades" },
    items: [
      {
        id: "mediterranica",
        name: "Mediterrânica",
        price: "9,95€",
        description: {
          pt: "Mistura de Alfaces, Tomate Cherry, Azeitonas, Mozzarella Fresca, Abacate, Vinagre Balsâmico Creme, Molho de Iogurte e Manjericão",
          en: "Mixed lettuces, cherry tomato, olives, fresh mozzarella, avocado, balsamic cream, yogurt and basil dressing",
          es: "Mezcla de lechugas, tomate cherry, aceitunas, mozzarella fresca, aguacate, crema de vinagre balsámico, salsa de yogur y albahaca",
          fr: "Mélange de laitues, tomate cerise, olives, mozzarella fraîche, avocat, crème de vinaigre balsamique, sauce yaourt et basilic",
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
          fr: "Laitue, poitrine de poulet grillée, croûtons, bacon croustillant, copeaux de parmesan, sauce Caesar",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "pregos",
    name: { pt: "Pregos", en: "Pregos", es: "Pregos", fr: "Pregos" },
    note: {
      pt: "Acompanhados de batata frita e maionese caseira, servidos em Bolo do Caco.",
      en: "Portuguese steak rolls, served with fries, homemade mayo, on Bolo do Caco bread.",
      es: "Bocadillos de bistec, servidos con patatas fritas, mayonesa casera, en pan Bolo do Caco.",
      fr: "Sandwichs de bœuf, servis avec frites, mayonnaise maison, sur pain Bolo do Caco.",
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
          fr: "Pain Bolo do Caco, moutarde de Dijon",
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
          fr: "Pain Bolo do Caco, fromage Manchego, pancetta frite, mayonnaise au basilic",
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
          fr: "Pain Bolo do Caco façon Ilha, tomate cerise confite, roquette, mayonnaise à l'ail",
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
          fr: "Pain Bolo do Caco, poitrine de poulet grillée, bacon croustillant, sauce Caesar, fromage parmesan",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "sobremesas",
    name: { pt: "Sobremesas", en: "Desserts", es: "Postres", fr: "Desserts" },
    items: [
      {
        id: "tarte-lima",
        name: "Tarte de Lima",
        price: "4,85€",
        description: {
          pt: "Tarte Caseira, Miami Style, Chantilly de Limão",
          en: "Homemade tart, Miami style, lime whipped cream",
          es: "Tarta casera, estilo Miami, chantillí de lima",
          fr: "Tarte maison, style Miami, chantilly au citron vert",
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
          fr: "Gâteau au chocolat maison",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "maioneses-extras",
    name: { pt: "Maioneses / Extras", en: "Mayonnaises / Extras", es: "Mayonesas / Extras", fr: "Mayonnaises / Extras" },
    items: [
      {
        id: "maionese-extra",
        name: "Maionese Extra",
        price: "0,60€",
        description: {
          pt: "Sabores: Pimentos Vermelhos, Manjericão, Alho, Molho Tártaro, Barbecue, Beringela",
          en: "Flavors: red pepper, basil, garlic, tartar, barbecue, eggplant",
          es: "Sabores: pimientos rojos, albahaca, ajo, tártara, barbacoa, berenjena",
          fr: "Saveurs : poivron rouge, basilic, ail, tartare, barbecue, aubergine",
        },
        allergens: null,
      },
      { id: "ketchup", name: "Ketchup", price: "0,20€", allergens: null },
    ],
  },
  {
    id: "limonadas",
    name: { pt: "Limonadas", en: "Lemonades", es: "Limonadas", fr: "Limonades" },
    items: [
      { id: "limonada-lima", name: "Lima", price: "3,90€", allergens: null },
      { id: "limonada-frutos-vermelhos", name: "Frutos Vermelhos", price: "3,90€", allergens: null },
    ],
  },
  {
    id: "cocktails",
    name: { pt: "Cocktails", en: "Cocktails", es: "Cócteles", fr: "Cocktails" },
    items: [
      {
        id: "basilic-gin-fizz",
        name: "Basilic Gin Fizz",
        price: "8,90€",
        description: {
          pt: "Gin Fizz intensamente envolvido em manjericão e gengibre.",
          en: "Gin Fizz intensely infused with basil and ginger.",
          es: "Gin Fizz intensamente envuelto en albahaca y jengibre.",
          fr: "Gin Fizz intensément infusé au basilic et au gingembre.",
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
          fr: "Rhum vieilli avec fruit de la passion, zeste d'orange amère et angostura bitters.",
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
          fr: "Gin maison avec limonade de fruits rouges.",
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
          fr: "Vodka, jus de citron vert, mousse de gingembre et zestes de citron vert.",
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
          fr: "Cachaça 51, citron vert et sucre roux liquide.",
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
          fr: "Rhum, citron vert, sucre liquide, menthe fraîche et eau gazeuse.",
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
          fr: "Tequila, jus de citron et liqueur d'orange.",
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
          fr: "Aperol, Prosecco, soda et zeste d'orange.",
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
          fr: "Café expresso, liqueur de café et vodka.",
        },
        allergens: null,
      },
    ],
  },
  {
    id: "gins",
    name: { pt: "Gins", en: "Gins", es: "Ginebras", fr: "Gins" },
    items: [
      { id: "hendricks", name: "Hendrick's", price: "11,00€", allergens: null },
      { id: "tanqueray", name: "Tanqueray", price: "8,00€", allergens: null },
    ],
  },
  {
    id: "bebidas",
    name: { pt: "Refrigerantes", en: "Soft Drinks", es: "Refrescos", fr: "Sodas" },
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
          fr: "Normal ou Zero",
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
          fr: "Citron, Pêche ou Thé Vert",
        },
        allergens: null,
      },
      { id: "cafe", name: "Café", price: "1,20€", allergens: null },
    ],
  },
  {
    id: "cervejas",
    name: { pt: "Cervejas", en: "Beers", es: "Cervezas", fr: "Bières" },
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
        description: { pt: "Sidra · 40cl", en: "Cider · 40cl", es: "Sidra · 40cl", fr: "Cidre · 40cl" },
        allergens: null,
      },
      {
        id: "corona",
        name: "Corona",
        price: "4,55€",
        description: { pt: "35cl · Garrafa", en: "35cl · Bottle", es: "35cl · Botella", fr: "35cl · Bouteille" },
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
          fr: "Sans Alcool · 25cl · Bouteille",
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
    name: { pt: "Outras Bebidas", en: "Other Drinks", es: "Otras Bebidas", fr: "Autres Boissons" },
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
        variantNote: { pt: "Branco ou Tinto", en: "White or Red", es: "Blanco o Tinto", fr: "Blanc ou Rouge" },
        allergens: null,
      },
    ],
  },
  {
    id: "vinhos-tintos",
    name: { pt: "Vinhos Tintos", en: "Red Wines", es: "Vinos Tintos", fr: "Vins Rouges" },
    items: [
      { id: "ea-cartuxa", name: "E.A. Cartuxa", price: "4,70€ / 15,90€", region: "Alentejo", allergens: null },
      { id: "duque-de-viseu", name: "Duque de Viseu", price: "4,70€ / 15,90€", region: "Dão", allergens: null },
      { id: "esteva", name: "Esteva", price: "4,40€ / 14,90€", region: "Douro", allergens: null },
    ],
  },
  {
    id: "vinhos-brancos",
    name: { pt: "Vinhos Brancos", en: "White Wines", es: "Vinos Blancos", fr: "Vins Blancs" },
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
    name: { pt: "Vinho Rosé", en: "Rosé Wine", es: "Vino Rosado", fr: "Vin Rosé" },
    items: [{ id: "rose", name: "Rosé", price: "3,90€ / 13,90€", allergens: null }],
  },
  {
    id: "vinho-verde",
    name: { pt: "Vinho Verde", en: "Vinho Verde", es: "Vinho Verde", fr: "Vinho Verde" },
    items: [
      { id: "muralhas-de-moncao", name: "Muralhas de Monção", price: "14,90€", region: "Minho", allergens: null },
    ],
  },
  {
    id: "sangrias",
    name: { pt: "Sangrias", en: "Sangrias", es: "Sangrías", fr: "Sangrias" },
    items: [
      { id: "sangria-tinta", name: "Tinta", price: "14,90€", allergens: null },
      { id: "sangria-branca", name: "Branca", price: "14,90€", allergens: null },
    ],
  },
];

/*
 * Top-level menu grouping — purely presentational, does not change any of
 * the real data above. Groups the 18 categories into 3 themes (Comida /
 * Bebidas / Vinhos) so the Menu section shows a handful of big tabs
 * instead of 18 flat pills. Bebidas is further split into two subgroups
 * (Sem Álcool / Com Álcool); Vinhos deliberately stays its own top-level
 * tab, not a Bebidas subgroup — wine is its own decision, not an
 * afterthought under "drinks".
 */
window.MENU_GROUPS = [
  {
    id: "comida",
    name: { pt: "Comida", en: "Food", es: "Comida", fr: "Nourriture" },
    categories: ["petiscos", "hamburgueres", "smash-burger", "pregos", "saladas", "sobremesas", "maioneses-extras"],
  },
  {
    id: "bebidas",
    name: { pt: "Bebidas", en: "Drinks", es: "Bebidas", fr: "Boissons" },
    subgroups: [
      {
        id: "sem-alcool",
        name: { pt: "Sem Álcool", en: "Non-Alcoholic", es: "Sin Alcohol", fr: "Sans Alcool" },
        categories: ["limonadas", "bebidas"],
      },
      {
        id: "com-alcool",
        name: { pt: "Com Álcool", en: "Alcoholic", es: "Con Alcohol", fr: "Avec Alcool" },
        categories: ["cocktails", "gins", "cervejas", "outras-bebidas", "sangrias"],
      },
    ],
  },
  {
    id: "vinhos",
    name: { pt: "Vinhos", en: "Wines", es: "Vinos", fr: "Vins" },
    categories: ["vinhos-tintos", "vinhos-brancos", "vinho-rose", "vinho-verde"],
  },
];
