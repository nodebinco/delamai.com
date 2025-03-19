import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('src/lib/data.db');

// Read JSON files
const sourcePath = '/home/panasun/Projects/panasun/delamai';
const brandsData = JSON.parse(fs.readFileSync(`${sourcePath}/lib/brands.json`, 'utf-8'));
const tagsData = JSON.parse(fs.readFileSync(`${sourcePath}/lib/tags.json`, 'utf-8'));
const productsData = JSON.parse(fs.readFileSync(`${sourcePath}/lib/products.json`, 'utf-8'));
const categoriesIdData = JSON.parse(
	fs.readFileSync(`${sourcePath}/lib/categories-id.json`, 'utf-8')
);
const categoriesNameData = JSON.parse(
	fs.readFileSync(`${sourcePath}/lib/categories-name.json`, 'utf-8')
);
const categoriesChildData = JSON.parse(
	fs.readFileSync(`${sourcePath}/lib/categories-child.json`, 'utf-8')
);

// Begin transaction
db.prepare('BEGIN').run();

try {
	const insertBrand = db.prepare('INSERT OR IGNORE INTO brands (id, name) VALUES (?, ?)');
	const insertBrands = db.transaction((brands) => {
		for (const brand of brands) {
			insertBrand.run(brand.id, brand.brand);
		}
	});

	for (let i = 0; i < brandsData.length; i += 1000) {
		const batch = brandsData.slice(i, i + 1000);
		insertBrands(batch);
	}

	console.log('Brands inserted successfully');

	console.log('First few tags:', tagsData.slice(0, 2));

	const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)');
	const insertTags = db.transaction((tags) => {
		for (const tag of tags) {
			insertTag.run(tag.id, tag.tag);
		}
	});

	for (let i = 0; i < tagsData.length; i += 1000) {
		const batch = tagsData.slice(i, i + 1000);
		insertTags(batch);
	}

	console.log('Tags inserted successfully');

	const categoryNameMap = new Map();
	for (const categoryName of categoriesNameData) {
		categoryNameMap.set(categoryName.category_en, categoryName.category_th);
	}

	const categoryParentMap = new Map();
	for (const item of categoriesChildData) {
		const parentId = String(item.category_parent);
		for (const childId of item.category_childs) {
			categoryParentMap.set(String(childId), parentId);
		}
	}

	const categoryData = [];
	for (const category of categoriesIdData) {
		const categoryId = String(category.category_id);
		const parentId = categoryParentMap.get(String(category.category_id)) || null;
		const nameTh = categoryNameMap.get(category.category_name) || '';

		categoryData.push({
			id: categoryId,
			nameTh,
			nameEn: category.category_name,
			parentId
		});
	}

	console.log('First few categories:', categoryData.slice(0, 2));

	const insertCategory = db.prepare(
		'INSERT OR IGNORE INTO categories (id, name_th, name_en, parent_id) VALUES (?, ?, ?, ?)'
	);
	const insertCategories = db.transaction((categories) => {
		for (const category of categories) {
			insertCategory.run(category.id, category.nameTh, category.nameEn, category.parentId);
		}
	});

	for (let i = 0; i < categoryData.length; i += 1000) {
		const batch = categoryData.slice(i, i + 1000);
		insertCategories(batch);
	}

	console.log('Categories inserted successfully');

	// Insert products
	const insertProduct = db.prepare(`
		INSERT OR IGNORE INTO products (
			id, price, sale_price, title, description, 
			item_sold, image_link, item_rating, global_brand,
			global_category1, global_category2, global_category3,
			global_catid1, global_catid2, global_catid3,
			product_link, short_description, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`);

	const insertProducts = db.transaction((products) => {
		for (const product of products) {
			insertProduct.run(
				product.item_id,
				product.price,
				product.sale_price,
				product.title,
				product.description,
				product.item_sold,
				product.image_link,
				product.item_rating,
				product.global_brand,
				product.global_category1,
				product.global_category2,
				product.global_category3,
				product.global_catid1,
				product.global_catid2,
				product.global_catid3,
				product.product_link,
				product.short_description,
				new Date().toISOString()
			);
		}
	});

	// Process products in batches of 1000
	for (let i = 0; i < productsData.length; i += 1000) {
		const batch = productsData.slice(i, i + 1000);
		insertProducts(batch);
	}

	console.log('Products inserted successfully');

	// Insert product tags
	const insertProductTag = db.prepare('INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES (?, ?)');
	const insertProductTags = db.transaction((products) => {
		for (const product of products) {
			// Ensure tags is an array
			const tags = Array.isArray(product.tags) ? product.tags : [];
			for (const tagName of tags) {
				const tag = tagsData.find((t) => t.tag === tagName);
				if (tag) {
					insertProductTag.run(product.item_id, tag.id);
				}
			}
		}
	});

	// Process product tags in batches of 100
	for (let i = 0; i < productsData.length; i += 100) {
		const batch = productsData.slice(i, i + 100);
		insertProductTags(batch);
	}

	console.log('Product tags inserted successfully');

	db.prepare('COMMIT').run();
	console.log('Data insertion completed successfully!');
} catch (error) {
	db.prepare('ROLLBACK').run();
	console.error('Error during insertion:', error);
	throw error;
} finally {
	db.close();
}
