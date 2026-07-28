<?php
/**
 * WooCommerce Template
 *
 * @package Raml
 */

get_header();

// Get current category/archive info
$page_title = '';
$page_description = '';

if (is_shop()) {
    $page_title = __('همه محصولات', 'raml');
    $page_description = __('مجموعه کامل سفال و سرامیک دست‌ساز رَمل', 'raml');
} elseif (is_product_category()) {
    $term = get_queried_object();
    $page_title = $term->name;
    $page_description = $term->description ?: __('محصولات این دسته‌بندی', 'raml');
} elseif (is_product_tag()) {
    $term = get_queried_object();
    $page_title = sprintf(__('برچسب: %s', 'raml'), $term->name);
    $page_description = $term->description;
} elseif (is_search()) {
    $page_title = sprintf(__('جستجو: %s', 'raml'), get_search_query());
    $page_description = '';
}
?>

<?php if (!is_product()) : ?>
<!-- Shop Header -->
<div class="shop-header">
    <div class="container">
        <h1><?php echo esc_html($page_title); ?></h1>
        <?php if ($page_description) : ?>
            <p><?php echo esc_html($page_description); ?></p>
        <?php endif; ?>
        <div class="product-count">
            <span><?php echo wc_get_loop_prop('total'); ?> <?php esc_html_e('محصول', 'raml'); ?></span>
        </div>
    </div>
</div>
<?php endif; ?>

<main class="site-main woocommerce-main">
    <?php woocommerce_content(); ?>
</main>

<style>
.woocommerce-main {
    padding: 2rem 0 4rem;
    min-height: 50vh;
}

.woocommerce-content {
    background: transparent;
}

/* Product archive styles */
.woocommerce .woocommerce-result-count {
    display: none;
}

/* Single product improvements */
.woocommerce div.product {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: var(--shadow-sm);
}

.woocommerce div.product div.images {
    margin-bottom: 0;
}

.woocommerce div.product div.summary {
    padding-right: 2rem;
}

.woocommerce div.product .woocommerce-tabs {
    margin-top: 3rem;
}

.woocommerce div.product .woocommerce-tabs ul.tabs {
    padding: 0;
    margin: 0;
    border: none;
}

.woocommerce div.product .woocommerce-tabs ul.tabs::before {
    display: none;
}

.woocommerce div.product .woocommerce-tabs ul.tabs li {
    background: var(--sand-50);
    border: none;
    border-radius: 0.5rem 0.5rem 0 0;
    margin-left: 0.25rem;
}

.woocommerce div.product .woocommerce-tabs ul.tabs li.active {
    background: white;
}

.woocommerce div.product .woocommerce-tabs ul.tabs li a {
    padding: 1rem 1.5rem;
    font-weight: 500;
}

.woocommerce div.product .woocommerce-tabs .panel {
    background: white;
    border: 1px solid var(--sand-100);
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 2rem;
}

/* Related products */
.woocommerce .related.products {
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid var(--sand-100);
}

.woocommerce .related.products h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
}

/* Reviews */
.woocommerce #reviews #comments {
    padding: 0;
}

.woocommerce #reviews .commentlist li {
    background: var(--sand-50);
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
}

.woocommerce #reviews #review_form_wrapper {
    margin-top: 2rem;
}

.woocommerce #reviews #commentform input[type="text"],
.woocommerce #reviews #commentform input[type="email"],
.woocommerce #reviews #commentform textarea {
    border-radius: 0.5rem;
    border: 1px solid var(--sand-200);
    padding: 0.75rem 1rem;
}

.woocommerce #reviews #commentform .submit {
    background: var(--clay-600);
    color: white;
    border-radius: 0.5rem;
    padding: 0.75rem 2rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
}

.woocommerce #reviews #commentform .submit:hover {
    background: var(--clay-700);
}

/* Star rating */
.woocommerce .star-rating {
    color: #f59e0b;
}

/* Quantity */
.woocommerce .quantity {
    display: flex;
    align-items: center;
}

.woocommerce .quantity .qty {
    width: 4rem;
    text-align: center;
    font-weight: 600;
}

/* Messages */
.woocommerce-message,
.woocommerce-info,
.woocommerce-error {
    background: white !important;
    border: 1px solid var(--sand-200) !important;
    border-radius: 0.75rem !important;
    padding: 1rem 1.5rem !important;
    margin-bottom: 1.5rem !important;
}

.woocommerce-message::before,
.woocommerce-info::before {
    color: var(--clay-600) !important;
}

/* Breadcrumb */
.woocommerce .woocommerce-breadcrumb {
    font-size: 0.875rem;
    color: var(--earth-400);
    margin-bottom: 1.5rem;
    padding: 0;
}

.woocommerce .woocommerce-breadcrumb a {
    color: var(--earth-500);
}

.woocommerce .woocommerce-breadcrumb a:hover {
    color: var(--clay-600);
}

/* Sale badge */
.woocommerce span.onsale {
    background: #ef4444 !important;
    color: white !important;
    font-weight: 700;
    min-width: auto;
    min-height: auto;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    line-height: 1;
}

/* Add to cart button variations */
.woocommerce div.product form.cart .variations {
    margin-bottom: 1.5rem;
}

.woocommerce div.product form.cart .variations select {
    border-radius: 0.5rem;
    border: 1px solid var(--sand-200);
    padding: 0.75rem 1rem;
}

/* Out of stock */
.woocommerce div.product .stock.out-of-stock {
    color: #ef4444;
    font-weight: 500;
}
</style>

<?php get_footer(); ?>
