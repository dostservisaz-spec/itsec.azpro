import React, { useState } from 'react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

export const uploadImage = async (file: File, bucket: string = 'public'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Upload error:', error);
    toast.error('Şəkil yüklənərkən xəta baş verdi');
    return null;
  }
};
