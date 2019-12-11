export * from './location.service';
import { LocationService } from './location.service';
export * from './user.service';
import { UserService } from './user.service';
export * from './userLocation.service';
import { UserLocationService } from './userLocation.service';
export const APIS = [LocationService, UserService, UserLocationService];
