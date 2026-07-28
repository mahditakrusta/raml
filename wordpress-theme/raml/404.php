<?php
/**
 * 404 Page Template
 *
 * @package Raml
 */

get_header();
?>

<main class="site-main error-404">
    <div class="container">
        <div class="error-content">
            <div class="error-icon">🏺</div>
            <h1><?php esc_html_e('صفحه یافت نشد!', 'raml'); ?></h1>
            <p><?php esc_html_e('متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.', 'raml'); ?></p>
            
            <div class="error-actions">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">
                    <?php esc_html_e('بازگشت به خانه', 'raml'); ?>
                </a>
                <?php if (class_exists('WooCommerce')) : ?>
                    <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="btn btn-secondary">
                        <?php esc_html_e('مشاهده محصولات', 'raml'); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<style>
.error-404 {
    padding: 8rem 0;
    text-align: center;
    min-height: 60vh;
    display: flex;
    align-items: center;
}

.error-content {
    max-width: 500px;
    margin: 0 auto;
}

.error-icon {
    font-size: 6rem;
    margin-bottom: 2rem;
    opacity: 0.5;
}

.error-content h1 {
    font-size: 2rem;
    color: var(--clay-800);
    margin-bottom: 1rem;
}

.error-content p {
    color: var(--earth-400);
    margin-bottom: 2rem;
    font-size: 1.125rem;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.error-actions .btn {
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s;
}

.error-actions .btn-primary {
    background: linear-gradient(to right, var(--clay-600), var(--clay-700));
    color: white;
}

.error-actions .btn-primary:hover {
    background: linear-gradient(to right, var(--clay-700), var(--clay-800));
    transform: translateY(-2px);
}

.error-actions .btn-secondary {
    background: var(--sand-100);
    color: var(--earth-700);
}

.error-actions .btn-secondary:hover {
    background: var(--sand-200);
}
</style>

<?php get_footer(); ?>
