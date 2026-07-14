import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserIcon, Mail, Phone, Clock } from 'lucide-react';

const UserProfile = () => {
  const { profile } = useAuth();
  
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-muted-foreground">Şəxsi məlumatlarınız və hesab detalları</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 sm:p-10 border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <UserIcon className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-2xl font-bold">{profile.full_name || 'İstifadəçi'}</h2>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground uppercase">
                {profile.role}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Qeydiyyat tarixi: {new Date(profile.created_at).toLocaleDateString('az-AZ')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h3 className="text-lg font-semibold mb-6">Əlaqə Məlumatları</h3>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground mb-1">
                <Mail className="h-4 w-4 mr-2" /> Email
              </div>
              <p className="font-medium">{profile.email}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground mb-1">
                <Phone className="h-4 w-4 mr-2" /> Telefon
              </div>
              <p className="font-medium">{profile.phone || 'Göstərilməyib'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
