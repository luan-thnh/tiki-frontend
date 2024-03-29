import loadable from '@loadable/component';
import Loading from '../../components/Loading';

export const createLoadable = (importStatement, props) =>
  loadable(importStatement, {
    fallback: <Loading {...props} />,
  });
