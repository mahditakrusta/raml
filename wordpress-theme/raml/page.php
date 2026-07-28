<?php
/**
 * Page Template
 *
 * @package Raml
 */

get_header();
?>

<main class="site-main">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <article id="page-<?php the_ID(); ?>" <?php post_class('page-content'); ?>>
                <header class="page-header">
                    <h1 class="page-title"><?php the_title(); ?></h1>
                </header>

                <div class="page-body">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<style>
.site-main {
    padding: 4rem 0;
}

.page-content {
    background: white;
    border-radius: 1rem;
    padding: 3rem;
    box-shadow: var(--shadow-sm);
}

.page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--sand-100);
}

.page-title {
    font-size: 2rem;
    color: var(--clay-800);
}

.page-body {
    color: var(--earth-700);
    line-height: 1.8;
}

.page-body h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.page-body p {
    margin-bottom: 1.5rem;
}

.page-body ul, .page-body ol {
    margin-bottom: 1.5rem;
    padding-right: 1.5rem;
}

.page-body li {
    margin-bottom: 0.5rem;
}

.page-body img {
    border-radius: 0.75rem;
    margin: 1.5rem 0;
}

.page-body a {
    color: var(--clay-600);
    text-decoration: underline;
}

.page-body a:hover {
    color: var(--clay-800);
}
</style>

<?php get_footer(); ?>
