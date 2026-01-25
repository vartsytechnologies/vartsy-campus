from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from tenancy.models import School

# Create your models here.
class AcademicYear(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="academic_year")
    name = models.CharField(max_length=100, help_text="Example: 2025/2026")
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('school', 'name'))
        ordering = ['-start_date']
        verbose_name = "Academic Year"
        verbose_name_plural = "Academic Years"

    def __str__(self):
        return f"{self.name}  {self.school.name}"
    
    def validateDate(self):
        if self.start_date >= self.end_date:
            raise ValidationError(_("Start date must be before end date."))
    
    def save(self, *args, **kwargs):
        if self.is_current:
            AcademicYear.objects.filter(
                school = self.school,
                is_current = True
            ).exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)


class Term(models.Model):
    TERM_CHOICES = (
        ('1', 'Term 1'),
        ('2', 'Term 2'),
        ('3', 'Term 3'),
    )
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="term")
    term_number = models.CharField(max_length=1, choices=TERM_CHOICES)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current =models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('academic_year', 'term_number'))
        ordering = ['academic_year', 'term_number']
        
    
    def __str__(self):
        return f"{self.get_term_number_display()} - {self.academic_year.name}"
    
    def save(self, *args, **kwargs):
        if self.is_current:Term.objects.filter(academic_year = self.academic_year,is_current=True).exclude(pk=self.pk).uppdate(is_current=False)
        super().save(*args, **kwargs)

class ClassLevel(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE,related_name='class_levels')
    name = models.CharField(max_length=120, help_text="SHS 1 General Arts, JHS 2, KG 1, etc.")
    short_code = models.CharField(max_length=20, blank=True, help_text="S1GA")
    level_order = models.PositiveSmallIntegerField(default=0, help_text="Lower=earlier year")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    class Meta:
        unique_together = (('school', 'name'))
        ordering = ['level_order', 'name']
        verbose_name = "Class Level"
        verbose_name_plural = "Class Levels"

    def __str__(self):
        return self.name
    
class ClassGroup(models.Model):
    """Specific class instance in a given academic year"""
    class_level = models.ForeignKey(ClassLevel, on_delete=models.PROTECT, related_name="instances")
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT, related_name="class_group")
    section = models.CharField(max_length=20, blank=True, help_text="Arts, Science, Business")
    capacity = models.PositiveSmallIntegerField(null=True, blank=True)
    room_number= models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Mete:
        unique_together = (('class_level', 'academic_year', 'section'),)
        ordering = ['class_level__level_order', 'section']

    def __str__(self):
        parts = [str(self.class_level)]
        if(self.selection):parts.append(self.selection)
        parts.append(f"({self.academic_year.name})")
        return " ".join(parts)
    
class Subject(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=255)
    short_code = models.CharField(max_length=20, blank=True)
    is_elective = models.BooleanField(default=False)
    is_examinable = models.BooleanField(default=True, help_text="Counts towards BECE/WASSCE")
    credit_hours = models.PositiveSmallIntegerField(default=1, blank=True)
    class_levels = models.ManyToManyField(ClassLevel, related_name="possible_subjects", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('school', 'name'),)
        ordering = ['name']
    
    def __str__(self):
        return self.name
        