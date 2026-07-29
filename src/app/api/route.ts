import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products, productImages, reviews } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Clear existing data
    await db.execute(sql`TRUNCATE TABLE order_items, orders, reviews, product_images, products, categories RESTART IDENTITY CASCADE`);

    // Insert categories
    const cats = await db.insert(categories).values([
      { name: "گلدان‌ها", slug: "vases", description: "گلدان‌های سفالی و سرامیکی دست‌ساز با طرح‌های اصیل ایرانی", image: "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
      { name: "ظروف سفره", slug: "tableware", description: "بشقاب، کاسه و ظروف سرو سفالی برای سفره‌ای زیبا", image: "https://images.pexels.com/photos/18273388/pexels-photo-18273388.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
      { name: "ست چای‌خوری", slug: "tea-sets", description: "ست‌های چای‌خوری سرامیکی با طراحی منحصر به فرد", image: "https://images.pexels.com/photos/18426652/pexels-photo-18426652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
      { name: "تزئینی", slug: "decorative", description: "اشیاء تزئینی سفالی برای دکوراسیون داخلی", image: "https://images.pexels.com/photos/18646120/pexels-photo-18646120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
    ]).returning();

    // Product data
    const productData = [
      {
        name: "گلدان نیلوفر آبی",
        slug: "blue-lotus-vase",
        description: "گلدان سفالی با نقش نیلوفر آبی، لعاب فیروزه‌ای",
        longDescription: "این گلدان زیبا با الهام از نقوش اصیل ایرانی و نیلوفرهای آبی طراحی شده است. لعاب فیروزه‌ای دست‌ساز با تکنیک خاص پخت دو مرحله‌ای، رنگی ماندگار و درخشان ایجاد می‌کند. ارتفاع مناسب برای گل‌های شاخه‌بریده و مصنوعی. هر قطعه منحصر به فرد است و ممکن است تفاوت‌های جزئی با تصویر داشته باشد.",
        price: "385000",
        originalPrice: "450000",
        categoryId: cats[0].id,
        featured: true,
        material: "سفال با لعاب فیروزه‌ای",
        dimensions: "ارتفاع ۲۸ سانتی‌متر × قطر ۱۵ سانتی‌متر",
        weight: "۱.۲ کیلوگرم",
      },
      {
        name: "ست سه‌تایی گلدان مینیاتور",
        slug: "miniature-vase-trio",
        description: "مجموعه سه گلدان کوچک با نقوش گل و بوته",
        longDescription: "این مجموعه سه‌تایی شامل سه گلدان کوچک با ارتفاع‌های متفاوت است که با نقوش ظریف گل و بوته آراسته شده‌اند. مناسب برای قرار دادن روی میز، طاقچه یا کنسول. رنگ‌بندی آبی و سفید کلاسیک، هماهنگ با انواع دکوراسیون.",
        price: "520000",
        originalPrice: null,
        categoryId: cats[0].id,
        featured: true,
        material: "سرامیک دست‌ساز با لعاب",
        dimensions: "ارتفاع ۱۲-۱۸ سانتی‌متر",
        weight: "۱.۸ کیلوگرم (مجموعه)",
      },
      {
        name: "گلدان رومیزی نقش‌دار",
        slug: "decorated-table-vase",
        description: "گلدان رومیزی با نقوش سنتی و لعاب لاجوردی",
        longDescription: "گلدان رومیزی با طراحی اصیل ایرانی و نقوش هندسی ظریف. لعاب لاجوردی عمیق با جلوه‌ای شاهانه. مناسب برای گل‌آرایی یا به عنوان آیتم تزئینی مستقل. دست‌ساز توسط هنرمندان با تجربه.",
        price: "290000",
        originalPrice: "350000",
        categoryId: cats[0].id,
        featured: false,
        material: "سفال لعاب‌دار",
        dimensions: "ارتفاع ۲۰ سانتی‌متر × قطر ۱۲ سانتی‌متر",
        weight: "۰.۹ کیلوگرم",
      },
      {
        name: "جفت گلدان سلطنتی",
        slug: "royal-vase-pair",
        description: "دو گلدان بزرگ با نقوش اسلیمی آبی و سفید",
        longDescription: "این جفت گلدان با شکوه، با نقوش اسلیمی و ختایی آبی بر زمینه سفید آراسته شده‌اند. مناسب برای دو طرف کنسول، شومینه یا ورودی خانه. ارتفاع بلند و فرم کلاسیک ایرانی. هر جفت در جعبه محافظ ارسال می‌شود.",
        price: "780000",
        originalPrice: "920000",
        categoryId: cats[0].id,
        featured: true,
        material: "چینی سفید با نقاشی آبی",
        dimensions: "ارتفاع ۳۵ سانتی‌متر × قطر ۱۸ سانتی‌متر",
        weight: "۳.۵ کیلوگرم (جفت)",
      },
      {
        name: "ست چای‌خوری سنتی",
        slug: "traditional-tea-set",
        description: "قوری و فنجان‌های سرامیکی با طرح گل‌های بهاری",
        longDescription: "ست کامل چای‌خوری شامل یک قوری، شش فنجان و شش نعلبکی. طرح گل‌های بهاری با رنگ‌های شاد و دلنشین. سرامیک با کیفیت بالا مقاوم در برابر حرارت. مناسب برای مهمانی‌ها و استفاده روزمره. قابل شستشو در ماشین ظرفشویی.",
        price: "650000",
        originalPrice: "750000",
        categoryId: cats[2].id,
        featured: true,
        material: "سرامیک مقاوم حرارت",
        dimensions: "قوری: ارتفاع ۱۵ سانتی‌متر، فنجان: ارتفاع ۷ سانتی‌متر",
        weight: "۲.۸ کیلوگرم (مجموعه)",
      },
      {
        name: "ست چای‌خوری گل‌سرخی",
        slug: "rose-tea-set",
        description: "ست چای‌خوری ظریف با نقش گل‌سرخ",
        longDescription: "ست چای‌خوری زیبا با نقش گل‌سرخ رنگارنگ. شامل قوری، شیرجوش، قندان، شش فنجان و نعلبکی. لعاب شفاف و براق. بسته‌بندی هدیه‌ای مناسب برای عیدی و مناسبت‌های ویژه.",
        price: "890000",
        originalPrice: null,
        categoryId: cats[2].id,
        featured: true,
        material: "سرامیک نقاشی شده",
        dimensions: "قوری: ارتفاع ۱۸ سانتی‌متر",
        weight: "۳.۲ کیلوگرم (مجموعه)",
      },
      {
        name: "ست ظروف سفره نیلوفر",
        slug: "lotus-tableware-set",
        description: "ست کامل ظروف سفره با طرح نیلوفر آبی",
        longDescription: "ست کامل ظروف سفره شامل شش بشقاب بزرگ، شش بشقاب کوچک، شش کاسه سوپ‌خوری و یک دیس بزرگ. طرح نیلوفر آبی روی زمینه سفید. سرامیک درجه یک مقاوم در برابر حرارت و قابل استفاده در مایکروویو.",
        price: "1250000",
        originalPrice: "1500000",
        categoryId: cats[1].id,
        featured: true,
        material: "سرامیک درجه یک",
        dimensions: "بشقاب بزرگ: قطر ۲۶ سانتی‌متر",
        weight: "۶.۵ کیلوگرم (مجموعه)",
      },
      {
        name: "ست ظروف آبی سلطنتی",
        slug: "royal-blue-tableware",
        description: "ست ظروف سفره با لعاب آبی سلطنتی",
        longDescription: "ست ظروف سفره با لعاب آبی عمیق و خطوط طلایی. شامل بشقاب‌ها، کاسه‌ها و قوری. کیفیت بالای سرامیک و لعاب ماندگار. مناسب برای مناسبت‌های ویژه و سفره‌های رسمی.",
        price: "980000",
        originalPrice: null,
        categoryId: cats[1].id,
        featured: false,
        material: "سرامیک لعاب‌دار",
        dimensions: "بشقاب: قطر ۲۴ سانتی‌متر",
        weight: "۵.۲ کیلوگرم (مجموعه)",
      },
      {
        name: "گلدان هنری مدرن",
        slug: "modern-art-vase",
        description: "گلدان با طراحی مدرن و فرم منحصر به فرد",
        longDescription: "این گلدان با ترکیب هنر سنتی و طراحی مدرن ساخته شده. فرم هندسی خاص با لعاب مات مشکی. مناسب برای فضاهای مدرن و مینیمال. اثر هنرمند مهرداد صفایی.",
        price: "420000",
        originalPrice: null,
        categoryId: cats[0].id,
        featured: false,
        material: "سفال با لعاب مات",
        dimensions: "ارتفاع ۳۲ سانتی‌متر × قطر ۱۴ سانتی‌متر",
        weight: "۱.۵ کیلوگرم",
      },
      {
        name: "ماگ دست‌ساز آبی",
        slug: "handmade-blue-mug",
        description: "ماگ سرامیکی دست‌ساز با لعاب آبی",
        longDescription: "ماگ سرامیکی دست‌ساز با لعاب آبی ملایم. فرم ارگونومیک دسته برای گرفتن راحت. مناسب برای چای، قهوه و نوشیدنی‌های گرم. هر ماگ منحصر به فرد و دست‌ساز است.",
        price: "145000",
        originalPrice: "180000",
        categoryId: cats[1].id,
        featured: false,
        material: "سرامیک دست‌ساز",
        dimensions: "ارتفاع ۱۰ سانتی‌متر × قطر ۸ سانتی‌متر",
        weight: "۰.۳۵ کیلوگرم",
      },
      {
        name: "مجسمه سفالی اسب",
        slug: "ceramic-horse-sculpture",
        description: "مجسمه تزئینی اسب سفالی با لعاب قهوه‌ای",
        longDescription: "مجسمه تزئینی اسب ساخته شده از سفال مرغوب با لعاب قهوه‌ای طبیعی. جزئیات دقیق و ظریف. مناسب برای ویترین، میز کار یا هدیه دادن. دست‌ساز توسط هنرمندان لالجین.",
        price: "340000",
        originalPrice: null,
        categoryId: cats[3].id,
        featured: false,
        material: "سفال لعاب‌دار",
        dimensions: "ارتفاع ۲۲ سانتی‌متر × طول ۲۵ سانتی‌متر",
        weight: "۱.۱ کیلوگرم",
      },
      {
        name: "بشقاب دیواری نقش ختایی",
        slug: "khatai-wall-plate",
        description: "بشقاب تزئینی دیواری با نقوش ختایی سنتی",
        longDescription: "بشقاب تزئینی دیواری با نقوش ختایی سنتی ایرانی. رنگ‌آمیزی دقیق با رنگ‌های طبیعی. دارای حلقه آویز پشت. مناسب برای تزئین دیوار اتاق پذیرایی، راهرو یا اتاق خواب.",
        price: "275000",
        originalPrice: "320000",
        categoryId: cats[3].id,
        featured: true,
        material: "سرامیک نقاشی شده",
        dimensions: "قطر ۳۰ سانتی‌متر",
        weight: "۰.۸ کیلوگرم",
      },
    ];

    const prods = await db.insert(products).values(productData).returning();

    // Product images
    const imageMap: Record<string, string[]> = {
      "blue-lotus-vase": [
        "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646117/pexels-photo-18646117.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646120/pexels-photo-18646120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "miniature-vase-trio": [
        "https://images.pexels.com/photos/18633243/pexels-photo-18633243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18635387/pexels-photo-18635387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646111/pexels-photo-18646111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "decorated-table-vase": [
        "https://images.pexels.com/photos/18635393/pexels-photo-18635393.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18635387/pexels-photo-18635387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "royal-vase-pair": [
        "https://images.pexels.com/photos/18635395/pexels-photo-18635395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18633243/pexels-photo-18633243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646117/pexels-photo-18646117.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "traditional-tea-set": [
        "https://images.pexels.com/photos/18426652/pexels-photo-18426652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18273384/pexels-photo-18273384.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18273388/pexels-photo-18273388.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "rose-tea-set": [
        "https://images.pexels.com/photos/18273384/pexels-photo-18273384.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18426652/pexels-photo-18426652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18426657/pexels-photo-18426657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "lotus-tableware-set": [
        "https://images.pexels.com/photos/18273388/pexels-photo-18273388.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18426657/pexels-photo-18426657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18273384/pexels-photo-18273384.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "royal-blue-tableware": [
        "https://images.pexels.com/photos/18426657/pexels-photo-18426657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18273388/pexels-photo-18273388.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "modern-art-vase": [
        "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646120/pexels-photo-18646120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "handmade-blue-mug": [
        "https://images.pexels.com/photos/31785816/pexels-photo-31785816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/34299319/pexels-photo-34299319.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "ceramic-horse-sculpture": [
        "https://images.pexels.com/photos/18646120/pexels-photo-18646120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18646111/pexels-photo-18646111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      "khatai-wall-plate": [
        "https://images.pexels.com/photos/18635387/pexels-photo-18635387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18635393/pexels-photo-18635393.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/18633243/pexels-photo-18633243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
    };

    const imageInserts = prods.flatMap((p) => {
      const urls = imageMap[p.slug] || [];
      return urls.map((url, i) => ({
        productId: p.id,
        url,
        alt: p.name,
        sortOrder: i,
      }));
    });
    if (imageInserts.length > 0) {
      await db.insert(productImages).values(imageInserts);
    }

    // Reviews
    const reviewers = [
      "مریم احمدی", "علی رضایی", "سارا محمدی", "حسین کریمی",
      "زهرا نوروزی", "محمد صادقی", "فاطمه حسینی", "رضا جعفری",
      "نیلوفر شریفی", "امیر کاظمی", "لیلا رحیمی", "پویا عباسی"
    ];

    const reviewComments = [
      "کیفیت فوق‌العاده! واقعاً ارزش خریدش رو داره.",
      "بسته‌بندی عالی بود و محصول سالم رسید. خیلی قشنگه!",
      "رنگ‌بندی خیلی خوشگله و دقیقاً مثل عکسشه.",
      "هدیه‌ای عالی بود. طرف مقابل خیلی خوشحال شد.",
      "دست‌ساز بودنش کاملاً مشخصه. هر قطعه‌اش یه شاهکاره.",
      "ارسال سریع و بسته‌بندی مطمئن. ممنون از رمل!",
      "برای دکوراسیون خونه خریدم. فضای خونه رو عوض کرد.",
      "قیمتش نسبت به کیفیتش خیلی مناسبه.",
      "بار دومه که از رمل خرید می‌کنم. همیشه راضی بودم.",
      "طراحی ایرانی خالص. افتخار می‌کنم که از صنایع دستی حمایت می‌کنم.",
    ];

    const reviewInserts = prods.flatMap((p, pi) => {
      const count = 2 + (pi % 3);
      return Array.from({ length: count }, (_, i) => ({
        productId: p.id,
        authorName: reviewers[(pi * 3 + i) % reviewers.length],
        rating: 4 + (i % 2),
        comment: reviewComments[(pi * 2 + i) % reviewComments.length],
      }));
    });

    await db.insert(reviews).values(reviewInserts);

    return NextResponse.json({ success: true, products: prods.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
