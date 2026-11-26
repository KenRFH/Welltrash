<?php

test('unknown urls render the NotFound page with a real 404 status', function () {
    $this->get('/halaman-yang-tidak-ada')
        ->assertNotFound()
        ->assertSee('NotFound', false);
});
