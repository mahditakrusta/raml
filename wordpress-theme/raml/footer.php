<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
                    <div class="logo-icon">
                        <span style="color: white; font-weight: 700;">ر</span>
                    </div>
                    <span class="logo-text">رَمل</span>
                </a>
                <p>
                    رَمل، برند سفال و سرامیک دست‌ساز ایرانی. هر قطعه با عشق و هنر ساخته شده تا زیبایی را به خانه شما بیاورد.
                </p>
            </div>

            <!-- Quick Links -->
            <div class="footer-links">
                <h4><?php esc_html_e('دسترسی سریع', 'raml'); ?></h4>
                <ul>
                    <?php if (class_exists('WooCommerce')) : ?>
                        <li><a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>"><?php esc_html_e('همه محصولات', 'raml'); ?></a></li>
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
                                <li><a href="<?php echo esc_url(get_term_link($category)); ?>"><?php echo esc_html($category->name); ?></a></li>
                                <?php
                            endforeach;
                        endif;
                        ?>
                    <?php endif; ?>
                </ul>
            </div>

            <!-- Info -->
            <div class="footer-info">
                <h4><?php esc_html_e('اطلاعات', 'raml'); ?></h4>
                <ul>
                    <li><span><?php esc_html_e('درباره ما', 'raml'); ?></span></li>
                    <li><span><?php esc_html_e('تماس با ما', 'raml'); ?></span></li>
                    <li><span><?php esc_html_e('سوالات متداول', 'raml'); ?></span></li>
                    <li><span><?php esc_html_e('شرایط ارسال', 'raml'); ?></span></li>
                    <li><span><?php esc_html_e('قوانین و مقررات', 'raml'); ?></span></li>
                </ul>
            </div>

            <!-- Contact -->
            <div class="footer-contact">
                <h4><?php esc_html_e('ارتباط با ما', 'raml'); ?></h4>
                
                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span><?php echo esc_html(get_theme_mod('contact_phone', '۰۲۱-۸۸۷۷۶۶۵۵')); ?></span>
                </div>

                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span><?php echo esc_html(get_theme_mod('contact_email', 'info@raml.ir')); ?></span>
                </div>

                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span><?php echo esc_html(get_theme_mod('contact_address', 'تهران، خیابان ولیعصر، کوچه هنر، پلاک ۱۲')); ?></span>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© <?php echo date('Y'); ?> رَمل — سفال و سرامیک دست‌ساز. <?php esc_html_e('تمامی حقوق محفوظ است.', 'raml'); ?></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<script>
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}
</script>

</body>
</html>
