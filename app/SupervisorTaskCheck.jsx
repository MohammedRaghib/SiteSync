import { View } from "react-native"
import { useTranslation } from 'react-i18next';
import { useRoute } from "@react-navigation/native";

function SupervisorTaskCheck() {
  const route = useRoute();
  const { t } = useTranslation();
  const { faceData } = route.params || {};

  

  return (
    <View>
      <Text>{t('supervisorTaskCheck')}</Text>
    </View>
  )
}

export default SupervisorTaskCheck