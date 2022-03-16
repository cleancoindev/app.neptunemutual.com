import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { toBytes32 } from "@/src/helpers/cover";
import { useCalculateLiquidity } from "@/src/hooks/provide-liquidity/useCalculateLiquidity";
import { formatAmount } from "@/utils/formatter";
import { useRemoveLiquidity } from "@/src/hooks/provide-liquidity/useRemoveLiquidity";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { useAppConstants } from "@/src/context/AppConstants";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
  myStake,
}) => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const [podValue, setPodValue] = useState();
  const [npmValue, setNpmValue] = useState();

  const { liquidityTokenAddress, NPMTokenAddress } = useAppConstants();
  const { receiveAmount } = useCalculateLiquidity({
    coverKey,
    podAmount: podValue,
  });
  const liquidityTokenSymbol = useTokenSymbol(liquidityTokenAddress);
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  const {
    balance,
    allowance,
    approving,
    withdrawing,
    handleApprove,
    handleWithdraw,
    vaultTokenSymbol,
    vaultTokenAddress,
  } = useRemoveLiquidity({
    coverKey,
    value: podValue || "0",
    npmValue: npmValue || "0",
  });

  // Clear on modal close
  useEffect(() => {
    if (isOpen) return;

    setPodValue();
    setNpmValue();
  }, [isOpen]);

  const handleChooseNpmMax = () => {
    setNpmValue(convertFromUnits(myStake).toString());
  };

  const handleChoosePodMax = () => {
    setPodValue(convertFromUnits(balance).toString());
  };

  const handleNpmChange = (val) => {
    if (typeof val === "string") {
      setNpmValue(val);
    }
  };

  const handlePodChange = (val) => {
    if (typeof val === "string") {
      setPodValue(val);
    }
  };

  const canWithdraw =
    podValue &&
    isValidNumber(podValue) &&
    isGreaterOrEqual(allowance, convertToUnits(podValue || "0"));

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={withdrawing}>
      <div className="relative inline-block w-full max-w-xl p-12 overflow-y-auto text-left align-middle max-h-90vh bg-f1f3f6 rounded-3xl">
        <Dialog.Title className="flex font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={withdrawing}
          onClick={onClose}
        ></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter Npm Amount"}
            tokenSymbol={npmTokenSymbol}
            handleChooseMax={handleChooseNpmMax}
            inputValue={npmValue}
            id={"my-staked-amount"}
            onChange={handleNpmChange}
            tokenAddress={NPMTokenAddress}
          >
            {isGreater(myStake, "0") && (
              <>
                Staked: {convertFromUnits(myStake).toString()} {npmTokenSymbol}
              </>
            )}
          </TokenAmountInput>
        </div>
        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter your POD"}
            tokenSymbol={vaultTokenSymbol}
            handleChooseMax={handleChoosePodMax}
            inputValue={podValue}
            id={"my-liquidity-amount"}
            onChange={handlePodChange}
            tokenBalance={balance}
            tokenAddress={vaultTokenAddress}
          />
        </div>
        <div className="mt-6 modal-unlock">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol={liquidityTokenSymbol}
            inputValue={formatAmount(
              convertFromUnits(receiveAmount).toString()
            )}
            inputId="my-liquidity-receive"
          />
        </div>

        <h5 className="block mt-6 mb-1 font-semibold text-black uppercase text-h6">
          NEXT UNLOCK CYCLE
        </h5>
        <div>
          <span className="text-7398C0" title={fromNow(info.withdrawalOpen)}>
            <strong>Open: </strong>
            {DateLib.toLongDateFormat(info.withdrawalOpen, "UTC")}
          </span>
        </div>
        <div>
          <span className="text-7398C0" title={fromNow(info.withdrawalClose)}>
            <strong>Close: </strong>
            {DateLib.toLongDateFormat(info.withdrawalClose, "UTC")}
          </span>
        </div>

        {!canWithdraw ? (
          <RegularButton
            onClick={handleApprove}
            className="w-full p-6 mt-8 font-semibold uppercase text-h6"
            disabled={approving}
          >
            {approving ? "Approving.." : "Approve"}
          </RegularButton>
        ) : (
          <RegularButton
            onClick={handleWithdraw}
            className="w-full p-6 mt-8 font-semibold uppercase text-h6"
            disabled={withdrawing}
          >
            {withdrawing ? "Withdrawing.." : "Withdraw"}
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
