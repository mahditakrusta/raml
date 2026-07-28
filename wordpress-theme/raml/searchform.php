<?php
/**
 * Search Form Template
 *
 * @package Raml
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <label class="screen-reader-text" for="search-field"><?php esc_html_e('جستجو:', 'raml'); ?></label>
    <input type="search" id="search-field" class="search-field" 
           placeholder="<?php esc_attr_e('جستجوی محصولات...', 'raml'); ?>" 
           value="<?php echo get_search_query(); ?>" 
           name="s" />
    <?php if (class_exists('WooCommerce')) : ?>
        <input type="hidden" name="post_type" value="product" />
    <?php endif; ?>
    <button type="submit" class="search-submit">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span class="screen-reader-text"><?php esc_html_e('جستجو', 'raml'); ?></span>
    </button>
</form>

<style>
.search-form {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid var(--sand-200);
    border-radius: 0.75rem;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-form:focus-within {
    border-color: var(--clay-300);
    box-shadow: 0 0 0 3px var(--clay-100);
}

.search-form .search-field {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    font-size: 0.875rem;
    background: transparent;
}

.search-form .search-field:focus {
    outline: none;
}

.search-form .search-submit {
    padding: 0.75rem 1rem;
    background: var(--clay-600);
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.search-form .search-submit:hover {
    background: var(--clay-700);
}

.search-form .search-submit svg {
    width: 1.25rem;
    height: 1.25rem;
}

.screen-reader-text {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
