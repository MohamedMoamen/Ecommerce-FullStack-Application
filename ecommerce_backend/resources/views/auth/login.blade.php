<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login / Register</title>
    <style>
        body { font-family: Arial; display: flex; justify-content: center; align-items: flex-start; padding-top: 50px; }
        .box { border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin: 0 10px; }
        input, select { display: block; margin: 10px 0; width: 100%; padding: 8px; }
        button { padding: 10px 15px; }
        .error { color: red; }
    </style>
</head>
<body>
    <!-- Login Box -->
    <div class="box">
        <h2>Login</h2>
        @if($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif
        <form method="POST" action="{{ route('login.submit') }}">
            @csrf
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <select name="role" required>
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Login</button>
        </form>
    </div>

    <!-- Register Box (for Users only) -->
    <div class="box">
        <h2>Register (User)</h2>
        <form method="POST" action="{{ route('register.submit') }}">
            @csrf
            <input type="text" name="name" placeholder="Name" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
    </div>
</body>
</html>
