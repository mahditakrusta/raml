<?php
/**
 * Main Index Template
 *
 * @package Raml
 */

get_header();
?>

<main class="site-main">
    <div class="container">
        <?php if (have_posts()) : ?>
            <div class="posts-grid">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>" class="post-thumbnail">
                                <?php the_post_thumbnail('large'); ?>
                            </a>
                        <?php endif; ?>
                        
                        <div class="post-content">
                            <header class="post-header">
                                <?php the_title(sprintf('<h2 class="post-title"><a href="%s">', esc_url(get_permalink())), '</a></h2>'); ?>
                                
                                <div class="post-meta">
                                    <span class="post-date"><?php echo get_the_date(); ?></span>
                                </div>
                            </header>
                            
                            <div class="post-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                            
                            <a href="<?php the_permalink(); ?>" class="read-more">
                                <?php esc_html_e('ادامه مطلب', 'raml'); ?>
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination(array(
                'prev_text' => __('قبلی', 'raml'),
                'next_text' => __('بعدی', 'raml'),
            )); ?>

        <?php else : ?>
            <div class="no-results">
                <h2><?php esc_html_e('مطلبی یافت نشد', 'raml'); ?></h2>
                <p><?php esc_html_e('متأسفانه هیچ مطلبی با معیارهای شما یافت نشد.', 'raml'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</main>

<style>
.site-main {
    padding: 4rem 0;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
}

@media (min-width: 768px) {
    .posts-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .posts-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.post-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.3s ease;
}

.post-card:hover {
    box-shadow: var(--shadow-lg);
}

.post-thumbnail img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.post-content {
    padding: 1.5rem;
}

.post-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.post-title a {
    color: var(--clay-800);
    transition: color 0.2s ease;
}

.post-title a:hover {
    color: var(--clay-600);
}

.post-meta {
    font-size: 0.875rem;
    color: var(--earth-400);
    margin-bottom: 1rem;
}

.post-excerpt {
    color: var(--earth-600);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.read-more {
    display: inline-block;
    color: var(--clay-600);
    font-weight: 500;
    font-size: 0.875rem;
}

.read-more:hover {
    color: var(--clay-800);
}

.no-results {
    text-align: center;
    padding: 4rem 0;
}

.no-results h2 {
    color: var(--earth-400);
    margin-bottom: 1rem;
}

.no-results p {
    color: var(--earth-300);
}
</style>

<?php get_footer(); ?>
