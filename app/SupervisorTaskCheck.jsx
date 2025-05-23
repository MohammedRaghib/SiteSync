import { View } from "react-native"
import { useTranslation } from 'react-i18next';

function SupervisorTaskCheck() {
    const { t } = useTranslation();
  return (
    <View>
      <Text>{t('supervisorTaskCheck')}</Text>
    </View>
  )
}

export default SupervisorTaskCheck