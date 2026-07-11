import { useState } from 'react'
import { MapCanvas } from './MapCanvas'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { FloatingControls } from './FloatingControls'
import { YouSheet } from './YouSheet'
import { NewListScreen } from './NewListScreen'
import { ListDetailSheet } from './ListDetailSheet'
import { RoadtripChatSheet } from './RoadtripChatSheet'
import { DriveSheet } from './DriveSheet'
import { INITIAL_LISTS, SEATTLE_PLACES } from './lists'
import './googleMapsClone.css'

export type Tab = 'explore' | 'you' | 'contribute'

type YouView = { screen: 'main' } | { screen: 'new-list' } | { screen: 'list-detail'; listId: string }

type RoadtripView = 'none' | 'ai-chat' | 'drive'

// Roughly the UW campus / Roosevelt area shown in the reference screenshots.
const UW_CENTER: [number, number] = [-122.3067, 47.6558]

export function GoogleMapsClone() {
  const [tab, setTab] = useState<Tab>('explore')
  const [lists, setLists] = useState(INITIAL_LISTS)
  const [youView, setYouView] = useState<YouView>({ screen: 'main' })
  const [roadtripView, setRoadtripView] = useState<RoadtripView>('none')
  const [routeInfo, setRouteInfo] = useState<{ durationSec: number; distanceMeters: number } | null>(null)

  const handleTabSelect = (nextTab: Tab) => {
    setTab(nextTab)
    if (nextTab !== 'you') setYouView({ screen: 'main' })
  }

  const activeList = youView.screen === 'list-detail' ? lists.find((list) => list.id === youView.listId) : undefined
  const mapRoadtripPlaces = activeList && activeList.places.length > 0 ? activeList.places : undefined

  // Closing the AI chat or Drive screen is a full reset back to the You tab,
  // not simple back-navigation like ListDetailSheet's onClose.
  const dismissRoadtrip = () => {
    setRoadtripView('none')
    setYouView({ screen: 'main' })
    handleTabSelect('you')
  }

  return (
    <div className="gmaps-clone">
      <MapCanvas
        center={UW_CENTER}
        zoom={15.5}
        roadtripPlaces={mapRoadtripPlaces}
        showRoute={roadtripView !== 'none'}
        onRouteInfo={setRouteInfo}
      />
      <TopBar minimal={roadtripView !== 'none'} />
      <FloatingControls />

      {tab === 'you' && youView.screen === 'main' && (
        <YouSheet
          lists={lists}
          onNewList={() => setYouView({ screen: 'new-list' })}
          onOpenList={(listId) => setYouView({ screen: 'list-detail', listId })}
        />
      )}

      {tab === 'you' && youView.screen === 'new-list' && (
        <NewListScreen
          onClose={() => setYouView({ screen: 'main' })}
          onCreate={(data) => {
            const id = `list-${Date.now()}`
            setLists((prev) => [{ id, places: [], collaborators: [], ...data }, ...prev])
            setYouView({ screen: 'list-detail', listId: id })
          }}
        />
      )}

      {tab === 'you' && activeList && (
        <ListDetailSheet
          list={activeList}
          onClose={() => setYouView({ screen: 'main' })}
          onAddPlace={(place) =>
            setLists((prev) =>
              prev.map((list) =>
                list.id === activeList.id ? { ...list, places: [...list.places, place] } : list
              )
            )
          }
          onAddPlaces={() =>
            setLists((prev) =>
              prev.map((list) => (list.id === activeList.id ? { ...list, places: SEATTLE_PLACES } : list))
            )
          }
          onInviteCollaborators={() =>
            setLists((prev) =>
              prev.map((list) =>
                list.id === activeList.id ? { ...list, collaborators: ['Josie', 'Kelley', 'Winnie'] } : list
              )
            )
          }
          onPlanRoadtrip={() => {
            // setTab directly, not handleTabSelect: switching tabs here must not
            // reset youView, since activeList needs to stay defined for the map
            // route and the chat/drive sheets below.
            setRoadtripView('ai-chat')
            setTab('explore')
          }}
        />
      )}

      {tab === 'explore' && roadtripView === 'ai-chat' && activeList && (
        <RoadtripChatSheet
          list={activeList}
          routeInfo={routeInfo}
          onViewRoute={() => setRoadtripView('drive')}
          onClose={dismissRoadtrip}
        />
      )}

      {tab === 'explore' && roadtripView === 'drive' && activeList && (
        <DriveSheet list={activeList} routeInfo={routeInfo} onClose={dismissRoadtrip} />
      )}

      <BottomNav active={tab} onSelect={handleTabSelect} />
    </div>
  )
}
