<?php
/**
 * رَمل Theme Functions
 *
 * @package Raml
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('RAML_VERSION', '1.0.0');
define('RAML_DIR', get_template_directory());
define('RAML_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function raml_setup() {
    // Text domain for translations
    load_theme_textdomain('raml', RAML_DIR . '/languages');

    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');

    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Register menus
    register_nav_menus(array(
        'primary'   => __('منوی اصلی', 'raml'),
        'footer'    => __('منوی فوتر', 'raml'),
    ));

    // Image sizes
    add_image_size('raml-product', 600, 600, true);
    add_image_size('raml-category', 400, 500, true);
    add_image_size('raml-hero', 1920, 1080, true);
}
add_action('after_setup_theme', 'raml_setup');

/**
 * Enqueue Scripts and Styles
 */
function raml_scripts() {
    // Google Fonts - Vazirmatn
    wp_enqueue_style(
        'raml-fonts',
        'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
        array(),
        null
    );

    // Main stylesheet
    wp_enqueue_style(
        'raml-style',
        get_stylesheet_uri(),
        array('raml-fonts'),
        RAML_VERSION
    );

    // Theme JavaScript
    wp_enqueue_script(
        'raml-script',
        RAML_URI . '/assets/js/main.js',
        array(),
        RAML_VERSION,
        true
    );

    // Localize script for AJAX
    wp_localize_script('raml-script', 'raml_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('raml_nonce'),
    ));

    // WooCommerce styles
    if (class_exists('WooCommerce')) {
        wp_enqueue_style(
            'raml-woocommerce',
            RAML_URI . '/assets/css/woocommerce.css',
            array('raml-style'),
            RAML_VERSION
        );
    }
}
add_action('wp_enqueue_scripts', 'raml_scripts');

/**
 * Register Widget Areas
 */
function raml_widgets_init() {
    register_sidebar(array(
        'name'          => __('سایدبار فروشگاه', 'raml'),
        'id'            => 'shop-sidebar',
        'description'   => __('ویجت‌های این قسمت در صفحات فروشگاه نمایش داده می‌شوند.', 'raml'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    register_sidebar(array(
        'name'          => __('فوتر ۱', 'raml'),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('فوتر ۲', 'raml'),
        'id'            => 'footer-2',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('فوتر ۳', 'raml'),
        'id'            => 'footer-3',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'raml_widgets_init');

/**
 * WooCommerce Setup
 */
function raml_woocommerce_setup() {
    // Remove default WooCommerce styles
    add_filter('woocommerce_enqueue_styles', '__return_empty_array');

    // Products per page
    add_filter('loop_shop_per_page', function() {
        return 12;
    });

    // Products per row
    add_filter('loop_shop_columns', function() {
        return 4;
    });
}
add_action('init', 'raml_woocommerce_setup');

/**
 * Remove WooCommerce default wrappers
 */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

function raml_woocommerce_wrapper_start() {
    echo '<div class="container"><div class="woocommerce-content">';
}
add_action('woocommerce_before_main_content', 'raml_woocommerce_wrapper_start', 10);

function raml_woocommerce_wrapper_end() {
    echo '</div></div>';
}
add_action('woocommerce_after_main_content', 'raml_woocommerce_wrapper_end', 10);

/**
 * Remove sidebar from WooCommerce
 */
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

/**
 * Custom Add to Cart AJAX
 */
function raml_ajax_add_to_cart() {
    check_ajax_referer('raml_nonce', 'nonce');

    $product_id = absint($_POST['product_id']);
    $quantity = empty($_POST['quantity']) ? 1 : wc_stock_amount($_POST['quantity']);

    if ($product_id && WC()->cart->add_to_cart($product_id, $quantity)) {
        WC_AJAX::get_refreshed_fragments();
    } else {
        wp_send_json_error();
    }

    wp_die();
}
add_action('wp_ajax_raml_add_to_cart', 'raml_ajax_add_to_cart');
add_action('wp_ajax_nopriv_raml_add_to_cart', 'raml_ajax_add_to_cart');

/**
 * Get cart count
 */
function raml_get_cart_count() {
    if (class_exists('WooCommerce')) {
        return WC()->cart->get_cart_contents_count();
    }
    return 0;
}

/**
 * Get cart total
 */
function raml_get_cart_total() {
    if (class_exists('WooCommerce')) {
        return WC()->cart->get_cart_total();
    }
    return 0;
}

/**
 * Format price in Persian
 */
function raml_format_price($price) {
    $formatted = number_format((float)$price, 0, '', '٬');
    // Convert to Persian numerals
    $persian_nums = array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹');
    $formatted = str_replace(range(0, 9), $persian_nums, $formatted);
    return $formatted . ' تومان';
}

/**
 * Get featured products
 */
function raml_get_featured_products($limit = 8) {
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => $limit,
        'meta_query'     => array(
            array(
                'key'   => '_featured',
                'value' => 'yes'
            )
        )
    );

    // If no featured products, get recent
    $featured = new WP_Query($args);
    
    if (!$featured->have_posts()) {
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => $limit,
            'orderby'        => 'date',
            'order'          => 'DESC'
        );
        $featured = new WP_Query($args);
    }

    return $featured;
}

/**
 * Get product categories
 */
function raml_get_product_categories($limit = 4) {
    $categories = get_terms(array(
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'number'     => $limit,
        'parent'     => 0, // Top level only
    ));

    return $categories;
}

/**
 * Get category thumbnail
 */
function raml_get_category_thumbnail($category_id) {
    $thumbnail_id = get_term_meta($category_id, 'thumbnail_id', true);
    if ($thumbnail_id) {
        return wp_get_attachment_image_url($thumbnail_id, 'raml-category');
    }
    return RAML_URI . '/assets/images/placeholder.jpg';
}

/**
 * Customizer settings
 */
function raml_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('raml_hero', array(
        'title'    => __('بخش هیرو', 'raml'),
        'priority' => 30,
    ));

    $wp_customize->add_setting('hero_title', array(
        'default'           => 'هنر سفال ایرانی در دستان شما',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('hero_title', array(
        'label'   => __('عنوان هیرو', 'raml'),
        'section' => 'raml_hero',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('hero_description', array(
        'default'           => 'هر قطعه روایتگر داستانی از هنر کهن ایرانی است. سفال و سرامیک دست‌ساز با کیفیت بی‌نظیر.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));

    $wp_customize->add_control('hero_description', array(
        'label'   => __('توضیحات هیرو', 'raml'),
        'section' => 'raml_hero',
        'type'    => 'textarea',
    ));

    $wp_customize->add_setting('hero_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_image', array(
        'label'   => __('تصویر پس‌زمینه هیرو', 'raml'),
        'section' => 'raml_hero',
    )));

    // Contact Info
    $wp_customize->add_section('raml_contact', array(
        'title'    => __('اطلاعات تماس', 'raml'),
        'priority' => 35,
    ));

    $wp_customize->add_setting('contact_phone', array(
        'default'           => '۰۲۱-۸۸۷۷۶۶۵۵',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('contact_phone', array(
        'label'   => __('شماره تماس', 'raml'),
        'section' => 'raml_contact',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('contact_email', array(
        'default'           => 'info@raml.ir',
        'sanitize_callback' => 'sanitize_email',
    ));

    $wp_customize->add_control('contact_email', array(
        'label'   => __('ایمیل', 'raml'),
        'section' => 'raml_contact',
        'type'    => 'email',
    ));

    $wp_customize->add_setting('contact_address', array(
        'default'           => 'تهران، خیابان ولیعصر، کوچه هنر، پلاک ۱۲',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));

    $wp_customize->add_control('contact_address', array(
        'label'   => __('آدرس', 'raml'),
        'section' => 'raml_contact',
        'type'    => 'textarea',
    ));
}
add_action('customize_register', 'raml_customize_register');

/**
 * Custom excerpt length
 */
function raml_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'raml_excerpt_length');

/**
 * Custom excerpt more
 */
function raml_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'raml_excerpt_more');

/**
 * Add body classes
 */
function raml_body_classes($classes) {
    if (is_front_page()) {
        $classes[] = 'front-page';
    }
    if (class_exists('WooCommerce')) {
        if (is_shop() || is_product_category() || is_product_tag()) {
            $classes[] = 'shop-page';
        }
        if (is_product()) {
            $classes[] = 'single-product-page';
        }
    }
    return $classes;
}
add_filter('body_class', 'raml_body_classes');

/**
 * Theme activation
 */
function raml_activation() {
    // Create default pages if they don't exist
    $pages = array(
        'shop'     => __('فروشگاه', 'raml'),
        'cart'     => __('سبد خرید', 'raml'),
        'checkout' => __('تسویه حساب', 'raml'),
        'my-account' => __('حساب کاربری', 'raml'),
    );

    foreach ($pages as $slug => $title) {
        if (!get_page_by_path($slug)) {
            wp_insert_post(array(
                'post_title'  => $title,
                'post_name'   => $slug,
                'post_status' => 'publish',
                'post_type'   => 'page',
            ));
        }
    }
}
add_action('after_switch_theme', 'raml_activation');

/**
 * Admin notice for WooCommerce
 */
function raml_admin_notice() {
    if (!class_exists('WooCommerce')) {
        echo '<div class="notice notice-warning is-dismissible">';
        echo '<p>' . __('قالب رَمل نیاز به افزونه WooCommerce دارد. لطفاً آن را نصب و فعال کنید.', 'raml') . '</p>';
        echo '</div>';
    }
}
add_action('admin_notices', 'raml_admin_notice');

/**
 * Include template parts
 */
function raml_get_template_part($slug, $name = null, $args = array()) {
    get_template_part('template-parts/' . $slug, $name, $args);
}
