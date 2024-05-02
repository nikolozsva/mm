import ColorLensIcon from '@mui/icons-material/ColorLens'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import HikingIcon from '@mui/icons-material/Hiking'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PhishingIcon from '@mui/icons-material/Phishing'
import AssistantIcon from '@mui/icons-material/Assistant'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import StorefrontIcon from '@mui/icons-material/Storefront'
import DataArrayIcon from '@mui/icons-material/DataArray'
import DrawIcon from '@mui/icons-material/Draw'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import PercentIcon from '@mui/icons-material/Percent'
import TerrainIcon from '@mui/icons-material/Terrain'
import EditIcon from '@mui/icons-material/Edit'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import TranslateIcon from '@mui/icons-material/Translate'

const IconGetter = {
  "ColorLensIcon": () => <ColorLensIcon />,
  "PhotoCameraIcon": () => <PhotoCameraIcon />,
  "HikingIcon": () => <HikingIcon />,
  "FitnessCenterIcon": () => <FitnessCenterIcon />,
  "PhishingIcon": () => <PhishingIcon />,
  "AssistantIcon": () => <AssistantIcon />,
  "ArchitectureIcon": () => <ArchitectureIcon />,
  "StorefrontIcon": () => <StorefrontIcon />,
  "DataArrayIcon": () => <DataArrayIcon />,
  "DrawIcon": () => <DrawIcon />,
  "CastForEducationIcon": () => <CastForEducationIcon />,
  "PercentIcon": () => <PercentIcon />,
  "TerrainIcon": () => <TerrainIcon />,
  "EditIcon": () => <EditIcon />,
  "SportsFootballIcon": () => <SportsFootballIcon />,
  "TranslateIcon": () => <TranslateIcon />,
}


const InterestKeyToName = {
  hobbies: 'WHAT’S YOUR HOBBY?',
  expertise: "WHAT'S YOUR CHOSEN FIELD OF EXPERTISE?",
  childhoodSubjects: 'WHAT SUBJECT SPARKED YOUR CURIOSITY THE MOST AS A CHILD?',
  ageRanges: 'YOUR AGE',
}

const Interests = {
  hobbies: [
    { name: 'PAINTING', icon: 'ColorLensIcon' },
    { name: 'PHOTOGRAPHY', icon: 'PhotoCameraIcon' },
    { name: 'HIKING', icon: 'HikingIcon' },
    { name: 'Fitness', icon: 'FitnessCenterIcon' },
    { name: 'FISHING', icon: 'PhishingIcon' },
    { name: 'OTHER', icon: 'AssistantIcon' }
  ],
  expertise: [
    { name: 'ARCHITECT', icon: 'ArchitectureIcon' },
    { name: 'MARKETER', icon: 'StorefrontIcon' },
    { name: 'DATA SCIENTIST', icon: 'DataArrayIcon' },
    { name: 'DESIGNER', icon: 'DrawIcon' },
    { name: 'TEACHER', icon: 'CastForEducationIcon' },
    { name: 'OTHER', icon: 'AssistantIcon' }
  ],
  childhoodSubjects: [
    { name: 'MATH', icon: 'PercentIcon' },
    { name: 'GEOGRAPHY', icon: 'TerrainIcon' },
    { name: 'WRITING', icon: 'EditIcon' },
    { name: 'SPORT', icon: 'SportsFootballIcon' },
    { name: 'LANGUAGES', icon: 'TranslateIcon' },
    { name: 'OTHER', icon: 'AssistantIcon' }
  ],
  ageRanges: [
    { name: '13-' },
    { name: '13-18' },
    { name: '18-22' },
    { name: '22-25' },
    { name: '25-30' },
    { name: '30+' },
  ]
}

export { Interests };
export { InterestKeyToName };
export { IconGetter };
