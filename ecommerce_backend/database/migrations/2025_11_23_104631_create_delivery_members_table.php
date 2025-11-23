<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeliveryMembersTable extends Migration
{
    public function up()
{
    Schema::create('delivery_members', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->string('phone')->nullable();
        $table->string('vehicle')->nullable();    
        $table->text('notes')->nullable();
        $table->timestamps();
    });
}


    public function down()
    {
        Schema::dropIfExists('delivery_members');
    }
}
