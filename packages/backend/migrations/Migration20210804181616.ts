import { Migration } from '@mikro-orm/migrations';

export class Migration20210804181616 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "address" ("id" serial primary key, "created_at" timestamptz(0) not null, "address_line1" varchar(255) not null, "address_line2" varchar(255) null, "city" varchar(255) not null, "province" varchar(255) null, "postal_code" varchar(255) not null, "country" text check ("country" in (\'US\', \'ES\')) not null);');

    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "name" varchar(255) not null, "role" text check ("role" in (\'admin\', \'merchant\', \'customer\')) not null, "password" varchar(255) null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('create index "user_role_index" on "user" ("role");');

    this.addSql('create table "order" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "number" varchar(255) not null, "total" int4 not null, "tax" int4 null, "notes" varchar(255) null, "shipped_at" date null, "customer_id" int4 not null, "shipping_address_id" int4 null, "billing_address_id" int4 null);');
    this.addSql('alter table "order" add constraint "order_number_unique" unique ("number");');

    this.addSql('create table "shop" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null);');

    this.addSql('create table "product" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "price" int4 not null, "length" int4 not null, "height" int4 not null, "width" int4 not null, "mass" int4 not null, "shop_id" int4 not null);');

    this.addSql('create table "line_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "quantity" int4 not null, "product_id" int4 not null, "order_id" int4 not null);');

    this.addSql('create table "shop_customers" ("shop_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "shop_customers" add constraint "shop_customers_pkey" primary key ("shop_id", "user_id");');

    this.addSql('create table "shop_merchants" ("shop_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "shop_merchants" add constraint "shop_merchants_pkey" primary key ("shop_id", "user_id");');

    this.addSql('alter table "order" add constraint "order_customer_id_foreign" foreign key ("customer_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_shipping_address_id_foreign" foreign key ("shipping_address_id") references "address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "order" add constraint "order_billing_address_id_foreign" foreign key ("billing_address_id") references "address" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product" add constraint "product_shop_id_foreign" foreign key ("shop_id") references "shop" ("id") on update cascade;');

    this.addSql('alter table "line_item" add constraint "line_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "line_item" add constraint "line_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');

    this.addSql('alter table "shop_customers" add constraint "shop_customers_shop_id_foreign" foreign key ("shop_id") references "shop" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "shop_customers" add constraint "shop_customers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "shop_merchants" add constraint "shop_merchants_shop_id_foreign" foreign key ("shop_id") references "shop" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "shop_merchants" add constraint "shop_merchants_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

}
