import log from '../../log';
import { platformDisplayNames } from '../constants';
import { Build } from '../types';
import { getBuildLogsUrl } from './url';

export interface DeprecationInfo {
  type: 'user-facing' | 'internal';
  message: string;
}

export function printLogsUrls(
  accountName: string,
  builds: { platform: 'android' | 'ios'; buildId: string }[]
): void {
  if (builds.length === 1) {
    const { buildId } = builds[0];
    const logsUrl = getBuildLogsUrl({
      buildId,
      account: accountName,
    });
    log(`Logs url: ${logsUrl}`);
  } else {
    builds.forEach(({ buildId, platform }) => {
      const logsUrl = getBuildLogsUrl({
        buildId,
        account: accountName,
      });
      log(`Platform: ${platformDisplayNames[platform]}, Logs url: ${logsUrl}`);
    });
  }
}

export function printBuildResults(builds: (Build | null)[]): void {
  if (builds.length === 1) {
    log(`Artifact url: ${builds[0]?.artifacts?.buildUrl ?? ''}`);
  } else {
    (builds.filter(i => i) as Build[])
      .filter(build => build.status === 'finished')
      .forEach(build => {
        log(
          `Platform: ${platformDisplayNames[build.platform]}, Artifact url: ${
            build.artifacts?.buildUrl ?? ''
          }`
        );
      });
  }
}

export function printDeprecationWarnings(deprecationInfo?: DeprecationInfo): void {
  if (!deprecationInfo) {
    return;
  }
  if (deprecationInfo.type === 'internal') {
    log.warn('This command is using API that soon will be deprecated, please update expo-cli.');
    log.warn("Changes won't affect your project confiuration.");
    log.warn(deprecationInfo.message);
  } else if (deprecationInfo.type === 'user-facing') {
    log.warn('This command is using API that soon will be deprecated, please update expo-cli.');
    log.warn(
      'There might be some changes necessary to your project configuration, latest expo-cli will provide more specific error messages.'
    );
    log.warn(deprecationInfo.message);
  } else {
    log.warn('An unexpected warning was encountered. Please report it as a bug:');
    log.warn(deprecationInfo);
  }
}