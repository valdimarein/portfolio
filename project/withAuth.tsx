// @ts-nocheck
import Loading from "@components/Loading";
import { useRouter } from "next/navigation";
import React, { ComponentType, FC } from "react";
import { useSession } from "@hooks/useTypedSession";
import { Session } from "@types-common/session.types";

const withAuth = <P extends { session: Session }>(
  Wrapped: ComponentType<P>
): FC<Omit<P, "session">> => {
  const WithAuth: FC<Omit<P, "session">> = (props) => {
    const router = useRouter();

    const { session, status } = useSession();

    if (status === "loading") {
      return <Loading />;
    }

    if (!session) {
      router.push(`/api/auth/signin?callbackUrl=${""}`);
      return null;
    }

    /* Inject Session into Wrapped Component */
    return <Wrapped {...(props as P)} session={session} />;
  };

  WithAuth.displayName = `WithAuth(${
    Wrapped.displayName || Wrapped.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
