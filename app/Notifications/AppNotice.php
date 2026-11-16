<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

/** One entry in the app's bell (notifications table). The phone push is sent separately by FcmService. */
class AppNotice extends Notification
{
    public function __construct(
        public string $title,
        public string $body,
        public array $data = [],
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return ['title' => $this->title, 'body' => $this->body] + $this->data;
    }
}
