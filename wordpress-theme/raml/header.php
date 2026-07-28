<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <div class="header-inner">
            <!-- Logo -->
            <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo">
                <div class="logo-icon">
                    <span>ر</span>
                </div>
                <div class="logo-text">
                    <span class="name">رَمل</span>
                    <span class="tagline">سفال و سرامیک دست‌ساز</span>
                </div>
            </a>

            <!-- Main Navigation -->
            <nav class="main-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'fallback_cb'    => 'raml_fallback_menu',
                ));
                ?>
            </nav>

            <!-- Header Actions -->
            <div class="header-actions">
                <!-- Cart Button -->
                <?php if (class_exists('WooCommerce')) : ?>
                    <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="cart-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <?php if (WC()->cart->get_cart_contents_count() > 0) : ?>
                            <span class="cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                        <?php endif; ?>
                    </a>
                <?php endif; ?>

                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" aria-label="<?php esc_attr_e('منو', 'raml'); ?>" onclick="toggleMobileMenu()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    <nav class="mobile-menu" id="mobile-menu">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'container'      => false,
            'items_wrap'     => '%3$s',
            'fallback_cb'    => 'raml_fallback_menu',
        ));
        ?>
    </nav>
</header>

<?php
/**
 * Fallback menu
 */
function raml_fallback_menu() {
    ?>
    <a href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('خانه', 'raml'); ?></a>
    <?php if (class_exists('WooCommerce')) : ?>
        <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>"><?php esc_html_e('محصولات', 'raml'); ?></a>
        <?php
        $categories = get_terms(array(
            'taxonomy'   => 'product_cat',
            'hide_empty' => true,
            'number'     => 4,
            'parent'     => 0,
        ));
        if (!empty($categories) && !is_wp_error($categories)) :
            foreach ($categories as $category) :
                ?>
                <a href="<?php echo esc_url(get_term_link($category)); ?>"><?php echo esc_html($category->name); ?></a>
                <?php
            endforeach;
        endif;
        ?>
    <?php endif; ?>
    <?php
}
?>
