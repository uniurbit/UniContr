@if (count($errors) > 0)
    <!-- Form Error List -->
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Errori</strong>

        <br><br>

        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>

        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
@endif
