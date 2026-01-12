export const Roles = {
  USER: 'user',
  VENDOR: 'vendor',
  CONSULTANT: 'consultant',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const RolePermissions = {
  user: ['read_services'],
  vendor: ['post_car', 'post_accommodation'],
  consultant: ['handle_consultation'],
  admin: ['manage_all'],
  super_admin: ['system_control', 'cleanup', 'analytics'],
};
