# Generated by Django 2.1.7 on 2019-02-19 16:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('associations', '0007_auto_20190219_1633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loan',
            name='loanable',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loans', to='associations.Loanable'),
        ),
    ]
