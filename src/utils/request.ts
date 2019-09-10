import axios, { AxiosError } from 'axios';
import qs from 'qs';

const inst = axios.create({
  timeout: 2000,
  withCredentials: true,
  headers: {},
});

// @cc: 检测 axios 响应状态
function onStatusError(error: AxiosError | Error) {
  const err =
    'response' in error && error.response
      ? {
          code: error.response.status,
          message: error.response.statusText,
        }
      : { code: 10001, message: error.message };
  if (err.code === 401 || err.code === 403) {
    // @todo 未登录未授权
    // EventCenter.emit('common.user.status', err);
  }
  return err;
}

export type AjaxPromise<R> = Promise<R>;

export interface ExtraFetchParams {
  extra?: any;
}

export interface WrappedFetchParams extends ExtraFetchParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD';
  url: string;
  data?: any; // post json
  form?: any; // post form
  query?: any;
  header?: any;
  path?: any;
}

export class WrappedFetch {
  /**
   * @description ajax 方法
   */
  public static ajax(
    { method, url, data, form, query, header, extra }: WrappedFetchParams,
    path?: string,
    basePath?: string,
  ) {
    let config = {
      ...extra,
      method: method.toLocaleLowerCase(),
      headers: { ...header },
    };
    // json
    if (data) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/json',
        },
        data,
      };
    }
    // form
    if (form) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(form),
      };
    }
    return inst
      .request({ ...config, url, params: query })
      .then(res => res.data)
      .catch(onStatusError);
  }

  /**
   * @description 接口传参校验
   */
  public static check<V>(value: V, name: string) {
    if (value === null || value === undefined) {
      const msg = `[ERROR PARAMS]: ${name} can't be null or undefined`;
      // 非生产环境，直接抛出错误
      if (process.env.NODE_ENV === 'development') {
        throw Error(msg);
      }
    }
  }
}

export default new WrappedFetch();
