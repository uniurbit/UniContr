import { DashboardRoutes } from './dashboard.routing';

describe('DashboardRoutes', () => {
  it('should expose the dashboard child routes', () => {
    expect(DashboardRoutes.length).toBeGreaterThan(0);
    const root = DashboardRoutes[0];
    expect(root.path).toBe('');
    expect(Array.isArray(root.children)).toBeTrue();

    const childPaths = (root.children ?? []).map(r => r.path);
    expect(childPaths).toContain('dashboarduffdocenti');
    expect(childPaths).toContain('dashboardufftrattamenti');
    expect(childPaths).toContain('dashboarddipartimento');
  });

  it('should protect dashboard routes with AuthGuard', () => {
    const children = DashboardRoutes[0].children ?? [];
    for (const r of children) {
      expect(r.canActivate?.length).toBeGreaterThan(0);
    }
  });
});
