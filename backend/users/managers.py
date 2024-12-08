from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("Вы должны подтвердить действующий email"))
        
    def create_user(self, first_name, last_name, email, password, **extra_fields):

        if not first_name:
            raise ValueError(_("Пользователь должен подтвердить Имя"))
        
        if not last_name:
            raise ValueError(_("Пользователь должен подтвердить Фамилию"))
        
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Пользователь: требуется адрес электронной почты"))
        

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user.save()

        return user
    

    def create_superuser(self, first_name, last_name, email, password, **extra_fields):


        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Администратор должен иметь статус is_superuser=True"))
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Администратор должен иметь статус is_staff=True"))
        
        if not password:
            raise ValueError(_("Адмнистратор должен иметь пароль"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Администратор: требуется адрес электронной почты"))
        

        user = self.create_user(first_name, last_name, email, password, **extra_fields)

        user.save()


        return user




