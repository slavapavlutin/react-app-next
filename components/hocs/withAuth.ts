import { SessionContext } from '@self/lib/types';
import { NextComponentType } from 'next';

function withAuth<P, IP>(
  Component: NextComponentType<P, IP, SessionContext>,
): NextComponentType<P, IP, SessionContext> {
  let originalGetInitialProps = Component.getInitialProps;

  Component.displayName = `withAuth(${Component.displayName})`;

  Component.getInitialProps = async (context: SessionContext) => {
    let { req, res } = context;

    if (req && !req.session.decodedToken) {
      if (res) {
        res.writeHead(302, { Location: '/login' });
        res.end();
      }
    }

    if (originalGetInitialProps) {
      let initialProps = await originalGetInitialProps(context);
      return initialProps;
    }
  };

  return Component;
}

export default withAuth;