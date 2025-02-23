@component('mail::message')
    {{ __('You have posted the following article') }}

    Title: {{$article->title}}

    @component('mail::button', ['url' => $acceptUrl])
        {{ __('View Article') }}
    @endcomponent

@endcomponent
