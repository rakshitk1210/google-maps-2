import type { Map as MapboxMap } from 'mapbox-gl'

// Google Maps light-mode tile palette, pixel-sampled from the reference
// screenshots in `Google Maps screenshots/` — see design.md §9 for the token
// table and application rules. Applied over Mapbox streets-v12 at runtime so
// every iteration's live map reads as Google Maps. Shared across iterations
// deliberately (an exception to the self-contained convention): §9 is a
// global visual standard, and palette fixes should reach every map at once.
export const GMAP = {
  land: '#F5F3F3',
  landInstitution: '#EFECEC',
  landCommercial: '#F8F0DE',
  landHospital: '#FCE8E6',
  landSand: '#F1EDE4',
  park: '#C3F1D5',
  vegetation: '#ABEDC8',
  water: '#90DAEE',
  building: '#EFECEC',
  buildingOutline: '#E4E1DF',

  roadMinor: '#D8E0E7',
  roadMinorCase: '#C9D3DA',
  roadArterial: '#FFFFFF',
  roadArterialCase: '#D7DBE0',
  roadMotorway: '#9BADCA',
  roadMotorwayCase: '#C6CFDE',
  pathGreen: '#9FD5BC',
  rail: '#E1DFDD',

  labelRoad: '#46586B',
  labelPlace: '#37404D',
  labelDistrict: '#7A8A98',
  labelArea: '#467686',
  labelPark: '#12875F',
  labelWater: '#4593AC',
  halo: '#FFFFFF',
} as const

// Repaints streets-v12's layers in place. Layer ids are matched by pattern so
// tunnel-/bridge- variants inherit the same treatment; unknown ids and
// mismatched paint props are skipped silently (style versions drift).
export function applyGoogleMapsPalette(map: MapboxMap) {
  const layers = map.getStyle()?.layers ?? []

  const paint = (id: string, prop: string, value: unknown) => {
    try {
      map.setPaintProperty(id, prop as never, value as never)
    } catch {
      /* prop doesn't exist on this layer — skip */
    }
  }
  const hide = (id: string) => {
    try {
      map.setLayoutProperty(id, 'visibility', 'none')
    } catch {
      /* skip */
    }
  }

  for (const layer of layers) {
    const { id, type } = layer

    if (type === 'background') {
      paint(id, 'background-color', GMAP.land)
      continue
    }

    // Pitched nav views (iterations 4/5/6) may render 3D buildings.
    if (type === 'fill-extrusion' && /building/.test(id)) {
      paint(id, 'fill-extrusion-color', GMAP.building)
      continue
    }

    if (type === 'fill') {
      if (/water/.test(id)) {
        paint(id, 'fill-color', GMAP.water)
      } else if (/landuse/.test(id)) {
        paint(id, 'fill-color', [
          'match',
          ['get', 'class'],
          ['park', 'grass', 'pitch', 'cemetery', 'scrub', 'wood'],
          GMAP.park,
          'hospital',
          GMAP.landHospital,
          ['school', 'airport', 'industrial'],
          GMAP.landInstitution,
          'commercial_area',
          GMAP.landCommercial,
          'sand',
          GMAP.landSand,
          'glacier',
          '#FFFFFF',
          GMAP.land,
        ])
      } else if (/landcover|national-park|natural|vegetation/.test(id)) {
        paint(id, 'fill-color', GMAP.vegetation)
      } else if (/building/.test(id)) {
        paint(id, 'fill-color', GMAP.building)
        paint(id, 'fill-outline-color', GMAP.buildingOutline)
      } else if (/pedestrian|path/.test(id)) {
        paint(id, 'fill-color', GMAP.roadMinor)
      } else if (/aeroway/.test(id)) {
        paint(id, 'fill-color', GMAP.landInstitution)
      }
      continue
    }

    if (type === 'line') {
      if (/waterway/.test(id)) {
        paint(id, 'line-color', GMAP.water)
      } else if (/motorway-trunk-case|major-link-case/.test(id)) {
        paint(id, 'line-color', GMAP.roadMotorwayCase)
      } else if (/motorway-trunk|major-link/.test(id)) {
        paint(id, 'line-color', GMAP.roadMotorway)
      } else if (/primary-case|secondary-tertiary-case/.test(id)) {
        paint(id, 'line-color', GMAP.roadArterialCase)
      } else if (/primary|secondary-tertiary/.test(id)) {
        paint(id, 'line-color', GMAP.roadArterial)
      } else if (/street-case|minor-case|service/.test(id)) {
        paint(id, 'line-color', GMAP.roadMinorCase)
      } else if (/street|minor|construction/.test(id)) {
        paint(id, 'line-color', GMAP.roadMinor)
      } else if (/path|steps|pedestrian|sidewalk|trail/.test(id)) {
        paint(id, 'line-color', GMAP.pathGreen)
      } else if (/rail/.test(id)) {
        paint(id, 'line-color', GMAP.rail)
      } else if (/aeroway/.test(id)) {
        paint(id, 'line-color', GMAP.roadMinorCase)
      } else if (/admin/.test(id)) {
        paint(id, 'line-color', '#C0BFC4')
      }
      continue
    }

    if (type === 'symbol') {
      paint(id, 'text-halo-color', GMAP.halo)
      if (/transit-label|ferry/.test(id)) {
        hide(id)
      } else if (/road-label|road-number|road-exit/.test(id)) {
        paint(id, 'text-color', GMAP.labelRoad)
      } else if (/settlement-subdivision/.test(id)) {
        paint(id, 'text-color', GMAP.labelDistrict)
      } else if (/settlement|state-label|country-label/.test(id)) {
        paint(id, 'text-color', GMAP.labelPlace)
      } else if (/water|natural/.test(id)) {
        paint(id, 'text-color', GMAP.labelWater)
      } else if (/poi-label/.test(id)) {
        // Category tint: green spaces get Google's park green, the rest a
        // muted slate so POIs sit back the way Google's do.
        paint(id, 'text-color', [
          'match',
          ['get', 'maki'],
          ['park', 'garden', 'picnic-site', 'golf', 'cemetery', 'dog-park', 'zoo'],
          GMAP.labelPark,
          '#5F7080',
        ])
      } else if (/airport-label/.test(id)) {
        paint(id, 'text-color', GMAP.labelArea)
      }
    }
  }
}
