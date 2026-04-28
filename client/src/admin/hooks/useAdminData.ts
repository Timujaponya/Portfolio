import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../constants';
import type { GithubRepository, NotificationState, Profile, Project, Service } from '../types';

interface UseAdminDataParams {
  isAuthenticated: boolean;
  onNotify: (message: string, type: NotificationState['type']) => void;
}

interface UseAdminDataResult {
  projects: Project[];
  githubProjects: GithubRepository[];
  services: Service[];
  profile: Profile | null;
  refreshProjects: () => Promise<void>;
  saveProject: (project: Project) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  saveService: (service: Service) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  saveProfile: (profile: Profile) => Promise<boolean>;
}

export const useAdminData = ({ isAuthenticated, onNotify }: UseAdminDataParams): UseAdminDataResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubProjects, setGithubProjects] = useState<GithubRepository[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/projects/admin`);
      const data = (await res.json()) as {
        result?: {
          dbProjects?: Project[];
          githubRepositories?: GithubRepository[];
        };
        projects?: Project[];
      };

      const dbProjects = data.result?.dbProjects || data.projects || [];
      setProjects(dbProjects);

      const githubRepos = data.result?.githubRepositories || [];
      setGithubProjects(githubRepos.filter((repo) => !repo.fork && !repo.archived));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
      setGithubProjects([]);
    }
  }, []);

  const refreshServices = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = (await res.json()) as { services?: Service[] };
      setServices(data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/profile`);
      const data = (await res.json()) as { profile?: Profile | null };
      setProfile(data.profile || null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void refreshProjects();
      void refreshServices();
      void refreshProfile();
    }
  }, [isAuthenticated, refreshProjects, refreshServices, refreshProfile]);

  const saveProject = useCallback(
    async (project: Project) => {
      try {
        const method = project._id ? 'PUT' : 'POST';
        const url = project._id ? `${API_URL}/projects/${project._id}` : `${API_URL}/projects`;

        const payload: Project = { ...project };
        if (method === 'POST' || !payload._id) {
          delete payload._id;
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          onNotify('İşlem başarısız oldu', 'error');
          return false;
        }

        await refreshProjects();
        onNotify(project._id ? 'Proje güncellendi!' : 'Proje eklendi!', 'success');
        return true;
      } catch (err) {
        console.error('Error saving project:', err);
        onNotify('Bir hata oluştu', 'error');
        return false;
      }
    },
    [onNotify, refreshProjects],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          onNotify('Silme işlemi başarısız', 'error');
          return false;
        }

        await refreshProjects();
        onNotify('Proje silindi', 'success');
        return true;
      } catch (err) {
        console.error('Error deleting project:', err);
        onNotify('Bir hata oluştu', 'error');
        return false;
      }
    },
    [onNotify, refreshProjects],
  );

  const saveService = useCallback(
    async (service: Service) => {
      try {
        const method = service._id ? 'PUT' : 'POST';
        const url = service._id ? `${API_URL}/services/${service._id}` : `${API_URL}/services`;

        const payload: Service = { ...service };
        if (method === 'POST' || !payload._id) {
          delete payload._id;
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          onNotify('İşlem başarısız oldu', 'error');
          return false;
        }

        await refreshServices();
        onNotify(service._id ? 'Servis güncellendi!' : 'Servis eklendi!', 'success');
        return true;
      } catch (err) {
        console.error('Error saving service:', err);
        onNotify('Bir hata oluştu', 'error');
        return false;
      }
    },
    [onNotify, refreshServices],
  );

  const deleteService = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          onNotify('Silme işlemi başarısız', 'error');
          return false;
        }

        await refreshServices();
        onNotify('Servis silindi', 'success');
        return true;
      } catch (err) {
        console.error('Error deleting service:', err);
        onNotify('Bir hata oluştu', 'error');
        return false;
      }
    },
    [onNotify, refreshServices],
  );

  const saveProfile = useCallback(
    async (profileData: Profile) => {
      try {
        const method = profileData._id ? 'PUT' : 'POST';
        const url = profileData._id ? `${API_URL}/profile/${profileData._id}` : `${API_URL}/profile`;

        const payload: Profile = { ...profileData };
        if (method === 'POST' || !payload._id) {
          delete payload._id;
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          onNotify('İşlem başarısız oldu', 'error');
          return false;
        }

        await refreshProfile();
        onNotify('Profil güncellendi!', 'success');
        return true;
      } catch (err) {
        console.error('Error saving profile:', err);
        onNotify('Bir hata oluştu', 'error');
        return false;
      }
    },
    [onNotify, refreshProfile],
  );

  return {
    projects,
    githubProjects,
    services,
    profile,
    refreshProjects,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    saveProfile,
  };
};
