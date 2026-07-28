<?php
/**
 * Front Page Template
 *
 * @package Raml
 */

get_header();

// Get hero image
$hero_image = get_theme_mod('hero_image');
if (!$hero_image) {
    $hero_image = 'https://images.pexels.com/photos/34259428/pexels-photo-34259428.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600';
}

// Get hero content
$hero_title = get_theme_mod('hero_title', 'هنر سفال ایرانی در دستان شما');
$hero_description = get_theme_mod('hero_description', 'هر قطعه روایتگر داستانی از هنر کهن ایرانی است. سفال و سرامیک دست‌ساز با کیفیت بی‌نظیر.');
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-bg">
        <img src="<?php echo esc_url($hero_image); ?>" alt="<?php esc_attr_e('سفالگری دست‌ساز', 'raml'); ?>">
        <div class="hero-overlay"></div>
    </div>

    <div class="container">
        <div class="hero-content">
            <div class="hero-badge">
                <span class="dot"></span>
                <span><?php esc_html_e('دست‌ساز با عشق', 'raml'); ?></span>
            </div>

            <h1 class="hero-title">
                <?php echo nl2br(esc_html($hero_title)); ?>
            </h1>

            <p class="hero-description">
                <?php echo esc_html($hero_description); ?>
            </p>

            <div class="hero-buttons">
                <?php if (class_exists('WooCommerce')) : ?>
                    <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="btn btn-primary">
                        <?php esc_html_e('مشاهده محصولات', 'raml'); ?>
                    </a>
                    <?php
                    $first_cat = get_terms(array(
                        'taxonomy'   => 'product_cat',
                        'hide_empty' => true,
                        'number'     => 1,
                        'parent'     => 0,
                    ));
                    if (!empty($first_cat) && !is_wp_error($first_cat)) :
                        ?>
                        <a href="<?php echo esc_url(get_term_link($first_cat[0])); ?>" class="btn btn-secondary">
                            <?php echo esc_html($first_cat[0]->name); ?>
                        </a>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="scroll-indicator">
        <span><?php esc_html_e('اسکرول کنید', 'raml'); ?></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
</section>

<!-- Trust Badges -->
<section class="trust-badges">
    <div class="container">
        <div class="badges-grid">
            <div class="badge-item">
                <span class="badge-icon">🎨</span>
                <div class="badge-text">
                    <h4><?php esc_html_e('صد در صد دست‌ساز', 'raml'); ?></h4>
                    <p><?php esc_html_e('ساخته شده توسط هنرمندان', 'raml'); ?></p>
                </div>
            </div>
            <div class="badge-item">
                <span class="badge-icon">🚚</span>
                <div class="badge-text">
                    <h4><?php esc_html_e('ارسال رایگان', 'raml'); ?></h4>
                    <p><?php esc_html_e('خرید بالای ۵۰۰ هزار تومان', 'raml'); ?></p>
                </div>
            </div>
            <div class="badge-item">
                <span class="badge-icon">🔄</span>
                <div class="badge-text">
                    <h4><?php esc_html_e('ضمانت بازگشت', 'raml'); ?></h4>
                    <p><?php esc_html_e('۷ روز ضمانت بازگشت کالا', 'raml'); ?></p>
                </div>
            </div>
            <div class="badge-item">
                <span class="badge-icon">💎</span>
                <div class="badge-text">
                    <h4><?php esc_html_e('کیفیت تضمینی', 'raml'); ?></h4>
                    <p><?php esc_html_e('مواد اولیه مرغوب', 'raml'); ?></p>
                </div>
            </div>
        </div>
    </div>
</section>

<?php if (class_exists('WooCommerce')) : ?>

<!-- Categories Section -->
<?php
$categories = raml_get_product_categories(4);
if (!empty($categories) && !is_wp_error($categories)) :
?>
<section class="categories-section section">
    <div class="container">
        <div class="section-header">
            <h2><?php esc_html_e('دسته‌بندی محصولات', 'raml'); ?></h2>
            <p><?php esc_html_e('مجموعه‌ای از زیباترین سفال و سرامیک‌های دست‌ساز ایرانی', 'raml'); ?></p>
        </div>

        <div class="categories-grid">
            <?php foreach ($categories as $category) : 
                $thumbnail = raml_get_category_thumbnail($category->term_id);
            ?>
                <a href="<?php echo esc_url(get_term_link($category)); ?>" class="category-card">
                    <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php echo esc_attr($category->name); ?>">
                    <div class="overlay"></div>
                    <div class="content">
                        <h3><?php echo esc_html($category->name); ?></h3>
                        <p><?php echo esc_html($category->description); ?></p>
                        <span class="link">
                            <?php esc_html_e('مشاهده', 'raml'); ?>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Featured Products Section -->
<?php
$featured_products = raml_get_featured_products(8);
if ($featured_products->have_posts()) :
?>
<section class="products-section section">
    <div class="container">
        <div class="section-header-flex">
            <div>
                <h2><?php esc_html_e('محصولات ویژه', 'raml'); ?></h2>
                <p><?php esc_html_e('منتخبی از بهترین آثار هنرمندان ما', 'raml'); ?></p>
            </div>
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="view-all-link">
                <span><?php esc_html_e('مشاهده همه', 'raml'); ?></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </a>
        </div>

        <div class="products-grid">
            <?php while ($featured_products->have_posts()) : $featured_products->the_post();
                global $product;
                $categories = get_the_terms(get_the_ID(), 'product_cat');
                $category_name = !empty($categories) ? $categories[0]->name : '';
            ?>
                <div class="product-card">
                    <a href="<?php the_permalink(); ?>" class="image-wrapper">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('raml-product'); ?>
                        <?php else : ?>
                            <img src="<?php echo esc_url(wc_placeholder_img_src()); ?>" alt="<?php the_title_attribute(); ?>">
                        <?php endif; ?>
                        <div class="image-overlay"></div>
                        
                        <?php if ($product->is_on_sale()) : 
                            $regular_price = (float) $product->get_regular_price();
                            $sale_price = (float) $product->get_sale_price();
                            $discount = round((($regular_price - $sale_price) / $regular_price) * 100);
                        ?>
                            <span class="discount-badge"><?php echo $discount; ?>% تخفیف</span>
                        <?php endif; ?>
                        
                        <?php if (!$product->is_in_stock()) : ?>
                            <div class="out-of-stock">
                                <span><?php esc_html_e('ناموجود', 'raml'); ?></span>
                            </div>
                        <?php endif; ?>
                    </a>

                    <div class="content">
                        <?php if ($category_name) : ?>
                            <span class="category"><?php echo esc_html($category_name); ?></span>
                        <?php endif; ?>
                        
                        <a href="<?php the_permalink(); ?>">
                            <h3><?php the_title(); ?></h3>
                        </a>

                        <div class="price-row">
                            <div class="price">
                                <span class="current-price"><?php echo number_format((float)$product->get_price(), 0, '', '٬'); ?></span>
                                <span class="currency"><?php esc_html_e('تومان', 'raml'); ?></span>
                                <?php if ($product->is_on_sale()) : ?>
                                    <span class="original-price"><?php echo number_format((float)$product->get_regular_price(), 0, '', '٬'); ?></span>
                                <?php endif; ?>
                            </div>

                            <?php if ($product->is_in_stock()) : ?>
                                <button class="add-to-cart" data-product-id="<?php echo get_the_ID(); ?>" aria-label="<?php esc_attr_e('افزودن به سبد', 'raml'); ?>">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>

        <div class="text-center mt-8" style="display: none;">
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="btn btn-primary">
                <?php esc_html_e('مشاهده همه محصولات', 'raml'); ?>
            </a>
        </div>
    </div>
</section>
<?php endif; ?>

<?php endif; // WooCommerce check ?>

<!-- CTA Banner -->
<section class="cta-banner">
    <div class="bg">
        <img src="https://images.pexels.com/photos/37328159/pexels-photo-37328159.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="<?php esc_attr_e('کارگاه سفالگری', 'raml'); ?>">
        <div class="bg-overlay"></div>
    </div>
    <div class="container">
        <div class="cta-content">
            <h2><?php esc_html_e('هنر در هر لمس', 'raml'); ?></h2>
            <p>
                <?php esc_html_e('هر قطعه سفال ما توسط هنرمندان با تجربه و با استفاده از تکنیک‌های سنتی ایرانی ساخته می‌شود. از خاک تا شاهکار، مسیری پر از عشق و هنر.', 'raml'); ?>
            </p>
            <?php if (class_exists('WooCommerce')) : ?>
                <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="btn btn-white">
                    <?php esc_html_e('کشف مجموعه', 'raml'); ?>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 1rem; height: 1rem; transform: rotate(180deg);">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </a>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Newsletter -->
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-content">
            <h2><?php esc_html_e('از جدیدترین محصولات باخبر شوید', 'raml'); ?></h2>
            <p><?php esc_html_e('با عضویت در خبرنامه، از تخفیف‌ها و محصولات جدید مطلع شوید.', 'raml'); ?></p>
            <form class="newsletter-form" action="#" method="post">
                <input type="email" name="email" placeholder="<?php esc_attr_e('ایمیل خود را وارد کنید', 'raml'); ?>" required>
                <button type="submit"><?php esc_html_e('عضویت', 'raml'); ?></button>
            </form>
        </div>
    </div>
</section>

<?php get_footer(); ?>
